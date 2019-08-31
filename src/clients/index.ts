import { Apps, Events, Logger, Router, Workspaces } from '@vtex/api'
import { dummyLogger } from './dummyLogger'

const createContext = (account: string, workspace: string, authToken: string, region: string) => {
  return {
    account,
    authToken,
    production: false,
    product: '',
    region,
    route: {
      id: '',
      params: {},
    },
    userAgent: '',
    workspace,
    requestId: '',
    operationId: '',
    logger: dummyLogger,
  }
}

const createClients = (account: string, workspace: string, authToken: string, region: string, options = {} as any) => {
  const context = createContext(account, workspace, authToken, region)
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
