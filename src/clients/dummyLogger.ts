import { Logger } from '@vtex/api/lib/service/logger'

const noop = () => {
  return
}

export const dummyLogger = ({
  account: '',
  workspace: '',
  operationId: '',
  requestId: '',
  platform: '',
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  sendLog: noop,
} as unknown) as Logger
