import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import chalk from 'chalk'

interface ClientOptions {
  authToken?: string
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  params?: Record<string, string>
}

export class HttpClient {
  protected http: AxiosInstance
  private baseURL: string

  constructor(options: ClientOptions) {
    const { authToken, baseURL, timeout, headers, params } = options
    this.baseURL = baseURL
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

    this.http.interceptors.request.use(req => {
      console.debug(`${req.method.toUpperCase()} to ${chalk.bold.blue(req.baseURL + req.url)}`)
      console.debug(`${chalk.bold(`Headers`)}`, req.headers)
      console.debug(`${chalk.bold(`Timeout`)}`, req.timeout)
      return req
    })
  }

  private buildFullURL = (path: string) => {
    return this.baseURL + path
  }

  public get = <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    console.debug(`GET to ${this.buildFullURL(url)}`)
    return this.http.get(url, config).then(response => response.data)
  }

  public getRaw = <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    console.debug(`Raw GET to ${this.buildFullURL(url)}`)
    return this.http.get(url, config)
  }

  public getStreamRaw = (url: string, config: AxiosRequestConfig = {}) => {
    console.debug(`GET stream from ${this.buildFullURL(url)}`)
    return this.http.get(url, { ...config, responseType: 'stream' })
  }

  public putRaw = <T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> => {
    console.debug(`PUT to ${this.buildFullURL(url)}`)
    return this.http.put(url, data, config)
  }
}
