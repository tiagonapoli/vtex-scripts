import fs from 'fs'
import os from 'os'
import path from 'path'

const vtexConfigPath = path.join(os.homedir(), '.config', 'configstore', 'vtex.json')

export class VtexConfig {
  private static config = JSON.parse(fs.readFileSync(vtexConfigPath, { encoding: 'utf8' }))

  static get token() {
    return this.config.token
  }

  static get workspace() {
    return this.config.workspace
  }

  static get account() {
    return this.config.account
  }

  static get region() {
    return 'aws-us-east-1'
  }
}
