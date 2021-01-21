import { IOContext } from '@vtex/api'
import { AxiosRequestConfig } from 'axios'
import { HttpClient } from './HttpClient'

const createRoutes = ({ account, workspace }: IOContext) => {
  const routes = {
    Templates: (argWorkspace: string) =>
      `/${account}/${argWorkspace || workspace}/buckets/vtex.pages-graphql/userData/files/store/templates.json`,
  }
  return routes
}

export class Templates {
  private http: HttpClient
  private _routes: ReturnType<typeof createRoutes>

  constructor(ctx: IOContext, options?: AxiosRequestConfig) {
    const { authToken } = ctx
    this.http = new HttpClient({
      ...options,
      authToken,
      baseURL: `https://infra.io.vtex.com/vbase/v2`,
    })
    this._routes = createRoutes(ctx)
  }

  private get routes() {
    return this._routes
  }

  public getWorkspaceTemplate = (workspace?: string) => {
    return this.http.get<TemplatesJSON>(this.routes.Templates(workspace), {
      headers: {
        Accept: 'application/json',
      },
    })
  }

  public updateWorkspaceTemplate = (migratedTemplate: TemplatesJSON, workspace?: string) => {
    return this.http.putRaw<string>(this.routes.Templates(workspace), migratedTemplate, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export type TemplatesJSON = Record<string, TreePathContainer>

export interface TreePathContainer {
  treePathContentMap: Record<string, string>
}
