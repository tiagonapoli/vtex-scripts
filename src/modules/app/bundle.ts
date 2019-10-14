import { AxiosError } from 'axios'
import chalk from 'chalk'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path'
import { pipeline } from 'stream'
import tar from 'tar'
import util from 'util'
import { createContext } from '../../clients'
import { Apps } from '../../clients/Apps'
import { VtexConfig } from '../../VtexConfig'

interface Arguments {
  dir?: string
  d?: string
  linked: boolean
  l: boolean
  appName: string
}

export default async (app: string, opts: Arguments) => {
  const dir = opts.dir || opts.d || './tmp'
  const linked = opts.l || opts.linked || false
  const apps = new Apps(createContext(VtexConfig), { timeout: 30000 })
  const appName = linked ? await apps.getApp(app).then(res => res.id) : app
  console.log(
    `Download bundle ${chalk.blue.bold(`${VtexConfig.account}/${VtexConfig.workspace}/${appName}`)} ==> ${dir}`
  )

  try {
    const res = await apps.getAppBundle(appName, '')
    const filenameRegex = /filename=(.*)/g
    const filename = filenameRegex.exec(res.headers['content-disposition'])[1].replace('.tar.gz', '')
    console.log(`Starting ${chalk.bold.blue(filename)}...`)
    console.log('Downloading and extracting...')
    const extractPath = join(dir, filename)
    ensureDirSync(extractPath)
    return await util.promisify(pipeline)([res.data, tar.extract({ cwd: extractPath + '/' })])
  } catch (err) {
    const axiosErr: AxiosError = err
    console.log(axiosErr.response.status, axiosErr.response.statusText)
  }
}
