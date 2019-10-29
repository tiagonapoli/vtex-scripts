import { Apps, Events, Logger, Router, Workspaces } from '@vtex/api'
import { dummyLogger } from './dummyLogger'
import { VtexConfig } from '../VtexConfig'

export const createContext = (config: typeof VtexConfig) => {
  return {
    account: config.account,
    authToken: config.token,
    production: false,
    product: '',
    platform: '',
    region: config.region,
    route: {
      id: '',
      params: {},
    },
    userAgent: '',
    workspace: config.workspace,
    requestId: '',
    operationId: '',
    logger: dummyLogger,
  }
}

const createClients = (config: typeof VtexConfig, options = {} as any) => {
  const context = createContext(config)
  const [apps, router, workspaces, logger, events] = [
    new Apps(context, options),
    new Router(context, options),
    new Workspaces(context, options),
    new Logger(context),
    new Events(context),
  ]
  return { apps, router, workspaces, logger, events }
}

export { createClients }
