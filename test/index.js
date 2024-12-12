import { ok, strictEqual, throws } from 'node:assert'
import tehanu from 'tehanu'
import { compareStories, configureSort, storySort } from '../lib/index.js'

const test = tehanu('test/index.js')

test('exports functions', () => {
  strictEqual(typeof compareStories, 'function')
  strictEqual(typeof storySort, 'function')
  strictEqual(typeof configureSort, 'function')
})

test('sorts unnamed stories', () => {
  const story1 = { title: '', name: '', type: 'story' }
  const story2 = { title: '', name: '', type: 'story' }
  strictEqual(compareStories(null, story1, story2), 0)
  strictEqual(compareStories(null, story2, story1), 0)
})

test('sorts one unnamed and one named stories', () => {
  const story1 = { title: '', name: '', type: 'story' }
  const story2 = { title: '', name: 'Story', type: 'story' }
  strictEqual(compareStories(null, story1, story2), -1)
  strictEqual(compareStories(null, story2, story1), 1)
})

test('sorts one unnamed and one named stories with an explicit order', () => {
  const story1 = { title: '', name: '', type: 'story' }
  const story2 = { title: '', name: 'Story', type: 'story' }
  const order = { '': { story: {} } }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts stories with the same names', () => {
  const story1 = { title: '', name: 'Story', type: 'story' }
  const story2 = { title: '', name: 'Story', type: 'story' }
  strictEqual(compareStories(null, story1, story2), 0)
  strictEqual(compareStories(null, story2, story1), 0)
})

test('sorts without groups alphabetically without specific order', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  strictEqual(compareStories(null, story1, story2), -1)
  strictEqual(compareStories(null, story2, story1), 1)
})

test('sorts without groups according to a specific order', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const order = { '': { story2: {}, story1: {} } }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts in a group alphabetically without specific order', () => {
  const story1 = { title: 'Test', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test', name: 'Story2', type: 'story' }
  strictEqual(compareStories(null, story1, story2), -1)
  strictEqual(compareStories(null, story2, story1), 1)
})

test('sorts in a group according to a specific order', () => {
  const story1 = { title: 'Test', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test', name: 'Story2', type: 'story' }
  const order = { test: { story2: {}, story1: {} } }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts stories using names made of multiple words', () => {
  const story1 = { title: '', name: 'Story Number One', type: 'story' }
  const story2 = { title: '', name: 'Story Number Two', type: 'story' }
  const order = { '': { 'story number two': {}, 'story number one': {} } }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts groups at the second level', () => {
  const story1 = { title: 'First/Second1', name: 'Story', type: 'story' }
  const story2 = { title: 'First/Second2', name: 'Story', type: 'story' }
  const order = {
    first: {
      second2: {},
      second1: {}
    }
  }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts groups at the third level', () => {
  const story1 = { title: 'First/Second/Third1', name: 'Story', type: 'story' }
  const story2 = { title: 'First/Second/Third2', name: 'Story', type: 'story' }
  const order = {
    first: {
      second: {
        third2: {},
        third1: {}
      }
    }
  }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts stories at the third level', () => {
  const story1 = { title: 'First/Second', name: 'Story1', type: 'story' }
  const story2 = { title: 'First/Second', name: 'Story2', type: 'story' }
  const order = {
    first: {
      second: {
        story2: {},
        story1: {}
      }
    }
  }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts with a wildcard at the first level of groups', () => {
  const story1 = { title: 'Test', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test', name: 'Story2', type: 'story' }
  const order = { '*': { story2: {}, story1: {} } }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts with a wildcard at deeper levels of groups', () => {
  const story1 = { title: 'Test/Stories', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test/Stories', name: 'Story2', type: 'story' }
  const order = { '**': { story2: {}, story1: {} } }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})

test('sorts with a custom comparator', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const compareNames = (name1, name2) => -name1.localeCompare(name2, { numeric: true })
  strictEqual(compareStories(null, story1, story2, { compareNames }), 1)
  strictEqual(compareStories(null, story2, story1, { compareNames }), -1)
})

test('sorts a complex example with *', () => {
  const story1 = { title: 'Articles', name: 'Getting Started', type: 'story' }
  const story2 = { title: 'Articles', name: 'Versioning', type: 'story' }
  const story3 = { title: 'Components/Header', name: 'Collapsed', type: 'story' }
  const story4 = { title: 'Components/Header', name: 'Default', type: 'story' }
  const story5 = { title: 'Components/Header', name: 'Expanded', type: 'story' }
  const story6 = { title: 'Elements/Button', name: 'Active', type: 'story' }
  const story7 = { title: 'Elements/Button', name: 'Default', type: 'story' }
  const story8 = { title: 'Elements/Link', name: 'Active', type: 'story' }
  const story9 = { title: 'Elements/Link', name: 'Default', type: 'story' }
  const order = {
    articles: {},
    elements: {
      '*': { default: null, },
    },
    components: {
      '*': { default: null, },
    },
  }
  strictEqual(compareStories(order, story1, story2), -1)
  strictEqual(compareStories(order, story1, story3), -1)
  strictEqual(compareStories(order, story1, story6), -1)
  strictEqual(compareStories(order, story2, story3), -1)
  strictEqual(compareStories(order, story3, story4), 1)
  strictEqual(compareStories(order, story4, story5), -1)
  strictEqual(compareStories(order, story4, story7), 1)
  strictEqual(compareStories(order, story5, story6), 1)
  strictEqual(compareStories(order, story6, story7), 1)
  strictEqual(compareStories(order, story6, story9), -1)
  strictEqual(compareStories(order, story7, story8), -1)
  strictEqual(compareStories(order, story8, story9), 1)
})

test('sorts a complex example with **', () => {
  const story1 = { title: 'Articles', name: 'Getting Started', type: 'story' }
  const story2 = { title: 'Articles', name: 'Versioning', type: 'story' }
  const story3 = { title: 'Components/Navigation/Header', name: 'Collapsed', type: 'story' }
  const story4 = { title: 'Components/Navigation/Header', name: 'Default', type: 'story' }
  const story5 = { title: 'Components/Navigation/Header', name: 'Expanded', type: 'story' }
  const story6 = { title: 'Components/Navigation/Header', name: 'With Search', type: 'story' }
  const story7 = { title: 'Components/Navigation/List', name: 'Collapsed', type: 'story' }
  const story8 = { title: 'Components/Navigation/List', name: 'Default', type: 'story' }
  const story9 = { title: 'Components/Navigation/List', name: 'Expanded', type: 'story' }
  const story10 = { title: 'Elements/Button', name: 'Active', type: 'story' }
  const story11 = { title: 'Elements/Button', name: 'Default', type: 'story' }
  const story12 = { title: 'Elements/Link', name: 'Active', type: 'story' }
  const story13 = { title: 'Elements/Link', name: 'Default', type: 'story' }
  const order = {
    '**': { default: null },
    articles: null,
    elements: null,
    components: {
      navigation: {
        header: {
          default: null,
          'with search': null
        }
      }
    }
  }
  strictEqual(compareStories(order, story1, story2), -1)
  strictEqual(compareStories(order, story1, story3), -1)
  strictEqual(compareStories(order, story1, story10), -1)
  strictEqual(compareStories(order, story2, story3), -1)
  strictEqual(compareStories(order, story3, story4), 1)
  strictEqual(compareStories(order, story3, story5), -1)
  strictEqual(compareStories(order, story3, story6), 1)
  strictEqual(compareStories(order, story4, story5), -1)
  strictEqual(compareStories(order, story4, story6), -1)
  strictEqual(compareStories(order, story4, story11), 1)
  strictEqual(compareStories(order, story5, story10), 1)
  strictEqual(compareStories(order, story5, story6), 1)
  strictEqual(compareStories(order, story7, story8), 1)
  strictEqual(compareStories(order, story7, story9), -1)
  strictEqual(compareStories(order, story8, story9), -1)
  strictEqual(compareStories(order, story10, story11), 1)
  strictEqual(compareStories(order, story10, story13), -1)
  strictEqual(compareStories(order, story11, story12), -1)
  strictEqual(compareStories(order, story12, story13), 1)
})

test('puts docs before stories by default', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  strictEqual(compareStories(null, docs, story), -1)
  strictEqual(compareStories(null, story, docs), 1)
})

test('puts docs before only if the stories are in the sdame group', () => {
  const docs = { title: 'Group 2', name: 'Docs', type: 'docs' }
  const story = { title: 'Group 1', name: 'Story', type: 'story' }
  strictEqual(compareStories(null, docs, story), 1)
  strictEqual(compareStories(null, story, docs), -1)
})

test('puts stories before docs when just story order is specified', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  const options = { typeOrder: ['story'] }
  strictEqual(compareStories(null, docs, story, options), 1)
  strictEqual(compareStories(null, story, docs, options), -1)
})

test('puts docs behind if requested', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  const options = { typeOrder: ['*', 'docs'] }
  strictEqual(compareStories(null, docs, story, options), 1)
  strictEqual(compareStories(null, story, docs, options), -1)
})

test('sorts by name if no type matched', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  const options = { typeOrder: ['other'] }
  strictEqual(compareStories(null, docs, story, options), -1)
  strictEqual(compareStories(null, story, docs, options), 1)
})

test('sorts by name if types were omitted', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  const options = { typeOrder: [] }
  strictEqual(compareStories(null, docs, story, options), -1)
  strictEqual(compareStories(null, story, docs, options), 1)
})

test('storySort fails if not configured before', () => {
  throws(() => storySort())
})

test('storySort accepts empty parameters', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  globalThis['storybook-multilevel-sort:params'] = {}
  strictEqual(storySort(docs, story), -1)
  strictEqual(storySort(story, docs), 1)
})

test('storySort recognises parameters via globalThis', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  globalThis['storybook-multilevel-sort:params'] = {
    typeOrder: ['story']
  }
  strictEqual(storySort(docs, story), 1)
  strictEqual(storySort(story, docs), -1)
})

test('configureSort initialises parameters via globalThis', () => {
  globalThis['storybook-multilevel-sort:params'] = null
  configureSort()
  ok(globalThis['storybook-multilevel-sort:params'], 'storybook-multilevel-sort:params')
})

test('configureSort exposes storySort via globalThis', () => {
  globalThis['storybook-multilevel-sort:params'] = null
  configureSort()
  ok(globalThis['storybook-multilevel-sort:storySort'], 'storybook-multilevel-sort:storySort')
})

test('configureSort passes typeOrder via globalThis', () => {
  const docs = { title: '', name: 'Docs', type: 'docs' }
  const story = { title: '', name: 'Story', type: 'story' }
  globalThis['storybook-multilevel-sort:params'] = null
  configureSort({ typeOrder: ['story'] })
  strictEqual(storySort(docs, story), 1)
  strictEqual(storySort(story, docs), -1)
})

test('configureSort passes storyOrder via globalThis', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const storyOrder = { '': { story2: {}, story1: {} } }
  globalThis['storybook-multilevel-sort:params'] = null
  configureSort({ storyOrder })
  strictEqual(storySort(story1, story2), 1)
  strictEqual(storySort(story2, story1), -1)
})

test('configureSort passes compareNames via globalThis', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const compareNames = (name1, name2) => -name1.localeCompare(name2, { numeric: true })
  globalThis['storybook-multilevel-sort:params'] = null
  configureSort({ compareNames })
  strictEqual(storySort(story1, story2), 1)
  strictEqual(storySort(story2, story1), -1)
})

// test('groups docs and stories together', () => {
//   const story1 = { title: '', name: 'Story1', type: 'story' }
//   const docs1 = { title: '', name: 'Docs1', type: 'docs' }
//   const story2 = { title: '', name: 'Story2', type: 'story' }
//   const docs2 = { title: '', name: 'Docs2', type: 'docs' }
//   equal(compareStories(null, story1, docs1), 1)
//   equal(compareStories(null, docs1, story1), -1)
// })
