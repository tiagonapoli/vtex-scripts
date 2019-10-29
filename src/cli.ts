#! /usr/bin/env node
import { find, run } from 'findhelp'
import { join } from 'path'
import tree from './modules/tree'

const timeSpent = (spent: [number, number]) => {
  const ms = spent[0] * 1000 + Math.round(spent[1] / 1e6)
  const sec = Math.floor(ms / 1000)
  return `${sec}.${ms - sec * 1000} seconds`
}

const main = async () => {
  const args = process.argv.slice(2)
  const command = await find(tree, args)
  const startTime = process.hrtime()
  await run.call(tree, command, join(__dirname, 'modules'))
  console.debug(timeSpent(process.hrtime(startTime)))
}

main().catch(err => {
  console.error(err)
})
