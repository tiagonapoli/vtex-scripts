import axios from 'axios'
import chalk from 'chalk'
import program from 'commander'
import { VtexConfig } from './VtexConfig'
import { createClients } from './clients'
import util from 'util'

program
  .option('-w, --workspace <workspace>', 'Workspace', VtexConfig.workspace)
  .option('-a, --account <account>', 'Account', VtexConfig.account)
  .option('-p, --app <appName>', 'App name')

program.parse(process.argv)

console.log(`Settings for ${chalk.blue.bold(`${program.account}/${program.workspace}/${program.app}`)}`)

const { apps } = createClients(program.account, program.workspace, VtexConfig.token, 'aws-us-east-1')

const go = async () => {
    const resolveAppId = async (appName: string): Promise<any> => await apps.getApp(appName).then(res => res)
    const appID = await resolveAppId(program.app)
    console.log(`AppID: ${chalk.bold.blue(appID)}`)

    const allApps = await apps.getAppsMetaInfos()
    console.log(util.formatWithOptions({ colors: true, depth: 4 }, '', allApps))
}

go()
