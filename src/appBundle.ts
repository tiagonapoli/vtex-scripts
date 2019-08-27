import chalk from 'chalk'
import program from 'commander'
import fs from 'fs'
import { ensureDirSync } from 'fs-extra'
import path from 'path'
import request from 'request'
import { pipeline } from 'stream'
import tar from 'tar-fs'
import util from 'util'
import zlib from 'zlib'
import { VtexConfig } from './VtexConfig'

program
  .option('-e, --extract', 'Extract', false)
  .option('-d, --dir <path>', 'Download path', '.')
  .option('-w, --workspace <workspace>', 'Workspace', VtexConfig.workspace)
  .option('-a, --account <account>', 'Account', VtexConfig.account)
  .option('-p, --app <appName>', 'App name')

program.parse(process.argv)
ensureDirSync(program.dir)

console.log(
  `Download bundle ${chalk.blue.bold(`${program.account}/${program.workspace}/${program.app}`)} ==> ${program.dir}`
)
const req = request.get(
  `http://apps.aws-us-east-1.vtex.io/${program.account}/${program.workspace}/apps/${program.app}/bundle`,
  { headers: { Authorization: VtexConfig.token } }
)

req.on('response', async res => {
  const filenameRegex = /filename=(.*)/g
  const filename = filenameRegex.exec(res.headers['content-disposition'])[1]
  console.log(`Starting ${chalk.bold.blue(filename)}...`)

  const fileWithoutExtension = filename.split('.')[0] + '.' + filename.split('.')[1]
  if (program.extract && res.headers['content-type'].includes('gzip')) {
    console.log('Downloading and extracting...')
    const unzip = zlib.createUnzip()
    await util.promisify(pipeline)([res, unzip, tar.extract(path.join(program.dir, fileWithoutExtension))])
  } else {
    console.log('Downloading...')
    res.pipe(fs.createWriteStream(path.join(program.dir, filename)))
  }
})
