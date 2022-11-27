module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    {
      name: 'storybook-addon-turbo-build',
      options: {
        optimizationLevel: 4,
        previewTranspiler() {
          return {
            loader: 'swc-loader'
          }
        },
        managerTranspiler() {
          return null
        }
      }
    }
  ],
  framework: '@storybook/html',
  core: {
    disableTelemetry: true,
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
        fsCache: true
      }
    }
  }
}