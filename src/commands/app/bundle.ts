import { flags as oclifFlags } from '@oclif/command'
import { AxiosError } from 'axios'
import chalk from 'chalk'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path'
import { pipeline } from 'stream'
import tar from 'tar'
import util from 'util'
import { createContext } from '../../clients'
import { Apps } from '../../clients/Apps'
import { CustomCommand } from '../../oclif/CustomCommand'
import { VtexConfig } from '../../VtexConfig'

export default class AppBundle extends CustomCommand {
  static description = 'Download app bundle'

  static examples = []

  static flags = {
    help: oclifFlags.help({ char: 'h' }),
    'app-id': oclifFlags.string({ char: 'a', description: 'App ID', required: true }),
    dir: oclifFlags.string({ char: 'd', description: 'Directory to save', default: '.' }),
    linked: oclifFlags.boolean({ char: 'l', description: 'App is linked', default: false }),
  }

  async run() {
    const { flags } = this.parse(AppBundle)
    const { dir, linked, 'app-id': app } = flags
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
}
