export default {
  handler: './',
  options: [
    {
      short: 'h',
      long: 'help',
      description: 'show help information',
      type: 'boolean',
    },
    {
      long: 'version',
      short: 'v',
      description: 'show version number',
      type: 'boolean',
    },
  ],
  publish: {
    requiredArgs: 'app',
    description: 'Publish this app',
    handler: console.log.bind(console),
  },
  app: {
    bundle: {
      description:
        'Get an app bundle from Apps. AppName has format vendor.appName. You can add @1.x or @1.0.0 terminations for example',
      handler: './app/bundle',
      requiredArgs: 'appName',
      options: [
        {
          description: 'Output folder',
          long: 'dir',
          short: 'd',
          type: 'string',
        },
        {
          description: 'App is linked',
          long: 'linked',
          short: 'l',
          type: 'boolean',
        },
      ],
    },
    types: {
      description:
        'Get an app types package from Apps. AppName has format vendor.appName. You can add @1.x or @1.0.0 terminations for example',
      handler: './app/types',
      requiredArgs: 'appName',
      options: [
        {
          description: 'Output folder',
          long: 'dir',
          short: 'd',
          type: 'string',
        },
        {
          description: 'App is linked',
          long: 'linked',
          short: 'l',
          type: 'boolean',
        },
      ],
    },
  },
}
