import axios from 'axios'
import chalk from 'chalk'
import program from 'commander'
import { VtexConfig } from './VtexConfig'
import { createClients } from './clients'

program
  .option('-w, --workspace <workspace>', 'Workspace', VtexConfig.workspace)
  .option('-a, --account <account>', 'Account', VtexConfig.account)
  .option('-p, --app <appName>', 'App name')

program.parse(process.argv)
console.log(`AppID for ${chalk.blue.bold(`${program.account}/${program.workspace}/${program.app}`)}`)

const { apps } = createClients(program.account, program.workspace, VtexConfig.token, 'aws-us-east-1')
const resolveAppId = async (appName: string): Promise<any> => await apps.getApp(appName).then(res => res)
resolveAppId(program.app).then((appID) => {
    console.log(chalk.bold.blue(appID))
})

