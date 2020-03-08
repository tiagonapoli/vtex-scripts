import { IOContext, parseAppId, removeVersionFromAppId, AppManifest } from '@vtex/api'
import { AxiosRequestConfig } from 'axios'
import { Readable } from 'stream'
import { HttpClient } from './HttpClient'

const createRoutes = ({ account, workspace }: IOContext) => {
  const routes = {
    Acknowledge: (app: string, service: string) => `${routes.App(app)}/acknowledge/${service}`,
    App: (app: string) => `${routes.Apps()}/${app}`,
    AppBundle: (locator: AppLocator, path: string) =>
      `${routes.AppOrRegistry(locator)}/bundle` + (path ? `/${path}` : ''),
    AppOrRegistry: ({ name, version, build }: AppLocator) =>
      build ? `${routes.Apps()}/${name}@${version}+${build}` : `${routes.Registry()}/${name}/${version}`,
    Apps: () => `${routes.Workspace}/apps`,
    Dependencies: () => `${routes.Workspace}/dependencies`,
    File: (locator: AppLocator, path: string) => `${routes.Files(locator)}/${path}`,
    Files: (locator: AppLocator) => `${routes.AppOrRegistry(locator)}/files`,
    Link: (app: string) => `${routes.Workspace}/v2/links/${app}`,
    Links: () => `${routes.Workspace}/links`,
    Master: `/${account}/master`,
    Meta: () => `${routes.Workspace}/v2/apps`,
    Registry: () => `${routes.Master}/registry`,
    ResolveDependencies: () => `${routes.Workspace}/dependencies/_resolve`,
    ResolveDependenciesWithManifest: () => `${routes.Workspace}/v2/apps/_resolve`,
    Settings: (app: string) => `${routes.App(app)}/settings`,
    Unlink: (app: string) => `${routes.Links()}/${app}`,
    Workspace: `/${account}/${workspace}`,
  }
  return routes
}

const getVendorAndName = ({ id }: { id: string }) => removeVersionFromAppId(id)

interface AppLocator {
  name: string
  version: string
  build?: string
}

export class Apps {
  private http: HttpClient
  private _routes: ReturnType<typeof createRoutes>

  constructor(ctx: IOContext, options?: AxiosRequestConfig) {
    const { region, authToken } = ctx
    this.http = new HttpClient({
      ...options,
      authToken,
      baseURL: `http://apps.${region}.vtex.io`,
    })
    this._routes = createRoutes(ctx)
  }

  private get routes() {
    return this._routes
  }

  //   public listAppFiles = (app: string, { prefix, nextMarker }: ListFilesOptions = {}) => {
  //     const locator = parseAppId(app)
  //     const linked = !!locator.build
  //     const params = {
  //       marker: nextMarker,
  //       prefix,
  //     }
  //     const metric = linked ? 'apps-list-files' : 'registry-list-files'
  //     const inflightKey = inflightUrlWithQuery
  //     return this.http.get<AppFilesList>(this.routes.Files(locator), { params, metric, inflightKey })
  //   }

  //   public getAppFileStream = (app: string, path: string): Promise<IncomingMessage> => {
  //     const locator = parseAppId(app)
  //     const metric = locator.build ? 'apps-get-file-s' : 'registry-get-file-s'
  //     return this.http.getStream(this.routes.File(locator, path), { metric })
  //   }

  public getApp = (app: string) => {
    return this.http.get<AppManifest>(this.routes.App(app))
  }

  //   public getAppSettings = (app: string) => {
  //     const inflightKey = inflightURL
  //     const metric = 'apps-get-settings'
  //     return this.http.get<any>(this.routes.Settings(app), { inflightKey, metric })
  //   }

  //   public getAllAppsSettings = (listAppsOptions: ListAppsOptions = {}): Promise<AppsSettings> => {
  //     return this.listApps(listAppsOptions).then(({ data: installedApps }: AppsList) => {
  //       const names = installedApps.map(getVendorAndName)
  //       const settingsPromises = names.map(vendorAndName => this.getAppSettings(vendorAndName).catch(notFound))
  //       return Promise.all(settingsPromises).then((settings: any[]) => {
  //         return zipObj(names, settings)
  //       })
  //     })
  //   }

  public getAppBundle = (app: string, bundlePath = '') => {
    const locator = parseAppId(app)
    return this.http.getStreamRaw(this.routes.AppBundle(locator, bundlePath), {
      headers: {
        Accept: 'application/x-gzip',
        'Accept-Encoding': 'gzip',
      },
    })
  }

  //   public getAppsMetaInfos = async (filter?: string) => {
  //     const metric = 'get-apps-meta'
  //     const inflightKey = inflightURL
  //     const appsMetaInfos = await this.http
  //       .get<WorkspaceMetaInfo>(this.routes.Meta(), { params: { fields: workspaceFields }, metric, inflightKey })
  //       .then(prop('apps'))
  //     if (filter) {
  //       return ramdaFilter(appMeta => !!ramdaPath(['_resolvedDependencies', filter], appMeta), appsMetaInfos)
  //     }
  //     return appsMetaInfos
  //   }
}

export interface AppMetaInfo {
  id: string
  settingsSchema?: Record<string, any>
  _resolvedDependencies: Record<string, string>
  _isRoot: boolean
  _buildFeatures: Record<string, string[]>
}

export interface WorkspaceMetaInfo {
  apps: AppMetaInfo[]
}

export interface AppsListItem {
  app: string
  id: string
  location: string
}

export interface AppsList {
  data: AppsListItem[]
}

export interface Change {
  path: string
  content: string | Readable | Buffer
}

export interface ListAppsOptions {
  oldVersion?: string
  context?: string[]
  since?: string
  service?: string
}

export interface ListFilesOptions {
  prefix?: string
  context?: string[]
  nextMarker?: string
}

export interface AppsSettings {
  [app: string]: any
}
