import sort from 'storybook-multilevel-sort'

const order = {
  articles: null,
  elements: {
    '*': { default: null }
  },
  components: {
    header: {
      default: null,
      'with search': null
    }
  }
}

export const parameters = {
  options: {
    storySort: (story1, story2) => sort(order, story1, story2)
  }
}
