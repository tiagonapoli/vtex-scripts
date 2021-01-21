import { flags as oclifFlags } from '@oclif/command'
import { AxiosError } from 'axios'
import { createContext } from '../../clients'
import { Templates, TemplatesJSON } from '../../clients/Templates'
import { CustomCommand } from '../../oclif/CustomCommand'
import { VtexConfig } from '../../VtexConfig'

function objectHasImageContent(object: any) {
  return valueHasImageContent(JSON.stringify(object))
}

function valueHasImageContent(value: string) {
  return value.search('/image') !== -1
}

function replaceImageTreepath(imageTreePath: string) {
  return imageTreePath.replace('/image', '/media')
}

function getMediaTemplates(jsonTemplates: TemplatesJSON, overrideMedia: boolean) {
  const mediaTemplates = jsonTemplates

  if (!objectHasImageContent(jsonTemplates)) {
    return null
  }

  Object.entries(jsonTemplates).forEach(([pageId, container]) => {
    if (!objectHasImageContent(container)) {
      return
    }

    const migratedContainer = container

    Object.entries(container.treePathContentMap).forEach(([treePath, contentValue]) => {
      // If it doesn't have an image content or (already has a media content defined and cannot override), just pass
      if (!valueHasImageContent(treePath) || (valueHasImageContent(replaceImageTreepath(treePath)) && !overrideMedia)) {
        return
      }

      const migratedTreePath = replaceImageTreepath(treePath)
      migratedContainer.treePathContentMap[migratedTreePath] = contentValue
    })

    mediaTemplates[pageId] = migratedContainer
  })

  return mediaTemplates
}

export default class AppBundle extends CustomCommand {
  static description = 'Migrate image content to media content'

  static examples = ['vtex-dev workspace:migrateToImage', 'vtex-dev workspace:migrateToImage "myworkspace"']

  static flags = {
    help: oclifFlags.help({ char: 'h' }),
    override: oclifFlags.boolean({
      char: 'o',
      description: 'Override existing media content if an image with the same treePath can be migrated',
      default: false,
    }),
  }

  static args = [{ name: 'workspace', required: false }]

  async run() {
    const { flags, args } = this.parse(AppBundle)
    const { workspace: workspaceArg } = args
    const { override: overrideMedia } = flags
    const ioContext = createContext(VtexConfig)

    const { account, workspace } = ioContext
    const templates = new Templates(createContext(VtexConfig), { timeout: 30000 })

    console.log(`Downloading template from account ${account} and workspace ${workspaceArg || workspace}`)

    try {
      const jsonTemplates = await templates.getWorkspaceTemplate(workspaceArg)

      console.log(`Finding image content...`)

      const mediaTemplates = getMediaTemplates(jsonTemplates, overrideMedia)

      if (!mediaTemplates) {
        console.log('There was no image content to migrate')
        return
      }

      console.log(`Migrating image content to media...`)

      await templates.updateWorkspaceTemplate(mediaTemplates, workspaceArg)

      console.log('All done!')
      return
    } catch (err) {
      const axiosErr: AxiosError = err
      console.log(axiosErr.response.status, axiosErr.response.statusText, axiosErr.message, axiosErr.stack)
    }
  }
}
