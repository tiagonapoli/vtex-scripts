import fs from 'fs'
import os from 'os'
import path from 'path'

const vtexConfigPath = path.join(os.homedir(), '.config', 'configstore', 'vtex.json')

const getConfig = (confPath: string) => {
  try {
    return JSON.parse(fs.readFileSync(confPath, { encoding: 'utf8' }))
  } catch(err) {
    console.log(err)
    return {}
  }
}

export class VtexConfig {
  private static config = getConfig(vtexConfigPath) 

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
