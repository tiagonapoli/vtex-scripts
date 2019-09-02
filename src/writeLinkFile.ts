import { Apps } from '@vtex/api'
import chalk from 'chalk'
import program from 'commander'
import { context } from './ioContext'
import { VtexConfig } from './VtexConfig'

program
  .option('-w, --workspace <workspace>', 'Workspace', VtexConfig.workspace)
  .option('-a, --account <account>', 'Account', VtexConfig.account)
  .option('-l, --applocator <appLocator>', 'App locator - vendor.appname@major.x')
  .option('-f, --filename <filename>', 'Filename to change')
  .option('-c, --content <content>', 'Content')
  .option('-d, --delete <files>', 'Files to delete, separated by comma(,)')

program.parse(process.argv)

const filesToDelete: string[] = program.delete.split(',')
console.log(`Update link ${chalk.bold.blue(`${program.account}/${program.workspace}/${program.applocator}`)}`)
console.log(`Delete:`, filesToDelete)
console.log(`Write: ${chalk.bold.blue(program.filename)} => ${chalk.bold.blue(program.content)}`)

const client = new Apps(context(program.account, program.workspace, VtexConfig.token, 'aws-us-east-1'), {
  timeout: 50000,
})

client
  .patch(program.applocator, [...filesToDelete.map(path => ({ path, content: '' }))], { zlib: { level: 1 } })
  .then(res => {
    console.log(res)
  })
