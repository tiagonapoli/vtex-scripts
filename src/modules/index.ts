import { help } from 'findhelp'
import pkg from '../../package.json'
import tree from './tree'

export default async options => {
  if (options.h || options.help) {
    console.log(help(tree, pkg))
  } else if (options.v || options.version) {
    console.log(pkg.version)
  } else {
    console.log(help(tree, pkg))
  }

  return Promise.resolve()
}
