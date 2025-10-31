import { configureSort } from 'storybook-multilevel-sort'

configureSort({
  storyOrder: {
    articles: null,
    elements: {
      '*': { default: null }
    },
    components: {
      navigation: {
        header: {
          default: null,
          'with search': null
        }
      }
    },
    '**': { default: null }
  }
})

export default {
  stories: [
    '../stories'
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite'
  },
  docs: {
    defaultName: 'Documentation'
  },
  core: {
    disableTelemetry: true
  }
}
