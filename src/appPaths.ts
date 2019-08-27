import axios from 'axios'
import chalk from 'chalk'
import program from 'commander'
import { VtexConfig } from './VtexConfig'

program
  .option('-w, --workspace <workspace>', 'Workspace', VtexConfig.workspace)
  .option('-a, --account <account>', 'Account', VtexConfig.account)
  .option('-p, --app <appName>', 'App name')

program.parse(process.argv)
console.log(`Show paths from ${chalk.blue.bold(`${program.account}/${program.workspace}/${program.app}`)}\n`)

axios
  .get(`http://apps.aws-us-east-1.vtex.io/${program.account}/${program.workspace}/apps/${program.app}/files`, {
    headers: { Authorization: VtexConfig.token },
  })
  .then(res => {
    const paths = res.data.data.map(el => el.path).sort()
    paths.forEach(el => console.log(el))
  })
