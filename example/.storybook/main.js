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
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-mdx-gfm'
  ],
  framework: {
    name: '@storybook/html-vite'
  },
  docs: {
    autodocs: true,
    defaultName: 'Documentation'
  },
  core: {
    disableTelemetry: true
  }
}
