import { Logger } from '@vtex/api/lib/service/logger'
import { IOContext } from '@vtex/api'

const noop = () => {
  return
}

const dummyLogger = (account: string, workspace: string) => {
  return ({
    account,
    workspace,
    operationId: '',
    requestId: '',
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    sendLog: noop,
  } as unknown) as Logger
}

export const context = (account: string, workspace: string, token: string, region: string) => {
  return {
    account,
    workspace,
    authToken: token,
    production: false,
    product: '',
    region,
    route: {
      id: '',
      params: {},
    },
    userAgent: 'scripts',
    requestId: '',
    operationId: '',
    logger: (dummyLogger as unknown) as Logger,
  } as IOContext
}
