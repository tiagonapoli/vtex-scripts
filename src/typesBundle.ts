import chalk from 'chalk'
import program from 'commander'
import fs from 'fs'
import { ensureDirSync } from 'fs-extra'
import path from 'path'
import request from 'request'
import { pipeline } from 'stream'
import tar from 'tar'
import util from 'util'
import { createClients } from './clients'
import { VtexConfig } from './VtexConfig'

program
  .option('-e, --extract', 'Extract', false)
  .option('-l, --linked', 'Get linked app types')
  .option('-o, --old', 'Get old app types')
  .option('-d, --dir <path>', 'Download path', '.')
  .option('-w, --workspace <workspace>', 'Workspace', VtexConfig.workspace)
  .option('-a, --account <account>', 'Account', VtexConfig.account)
  .option('-p, --app <appName>', 'App id -> Example vtex.admin@1.x')

program.parse(process.argv)
ensureDirSync(program.dir)

const { apps } = createClients(program.account, program.workspace, VtexConfig.token, 'aws-us-east-1')
const resolveAppId = async (appName: string): Promise<string> => await apps.getApp(appName).then(res => res.id)
resolveAppId(program.app).then(appID => {
  console.log(appID)
  console.log(
    `Download ${program.old ? 'old' : 'new'} types bundle from ${
      program.linked ? 'linked' : 'unlinked'
    } ${chalk.blue.bold(`${program.account}/${program.workspace}/${appID}`)} ==> ${program.dir}`
  )

  const suffix = program.old ? `/_types` : `/@types/${program.appName}`
  const base = program.linked
    ? `https://${program.workspace}--${program.account}.myvtex.com/_v/private/typings/linked/v1/${appID}/public`
    : `http://vtex.vteximg.com.br/_v/public/typings/v1/${appID}/public`

  const url = base + suffix
  const req = request.get(url, { headers: { Authorization: VtexConfig.token } })

  console.log(url)

  req.on('response', async res => {
    const filename = `types_${program.linked ? 'linked' : 'unlinked'}_${program.old ? 'old' : 'new'}_${appID}.tar.gz`
    console.log(`Starting ${chalk.bold.blue(filename)}...`)

    const fileWithoutExtension = filename.replace('.tar.gz', '')
    if (program.extract) {
      console.log('Downloading and extracting...')
      const ee = tar.list()
      ee.on('entry', data => console.log(data.path))
      ensureDirSync(path.join(program.dir, fileWithoutExtension))
      const extractPath = path.join(program.dir, fileWithoutExtension)
      const pipeline1 = util.promisify(pipeline)([res, ee])
      await util.promisify(pipeline)([res, tar.extract({ cwd: extractPath + '/' })])
      await pipeline1
    } else {
      console.log('Downloading...')
      res.pipe(fs.createWriteStream(path.join(program.dir, filename)))
    }
  })
})
