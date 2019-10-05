import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { IncomingMessage } from 'http'

interface ClientOptions {
  authToken?: string
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  params?: Record<string, string>
}

export class HttpClient {
  protected http: AxiosInstance

  constructor(options: ClientOptions) {
    const { authToken, baseURL, timeout, headers, params } = options
    this.http = axios.create({
      baseURL,
      params,
      timeout,
      headers: {
        'Accept-Encoding': 'gzip',
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
    })
  }

  public get = <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    return this.http.get(url, config).then(response => response.data)
  }

  public getRaw = <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    return this.http.get(url, config)
  }

  public getStreamRaw = (url: string, config: AxiosRequestConfig = {}) => {
    return this.http.get(url, { ...config, responseType: 'stream' })
  }
}
