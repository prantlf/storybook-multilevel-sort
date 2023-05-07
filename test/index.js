import { equal } from 'assert'
import tehanu from 'tehanu'
import { compareStories } from '../lib/index.js'

const test = tehanu('test/index.js')

test('exports a function', () => {
  equal(typeof compareStories, 'function')
})

test('sorts unnamed stories', () => {
  const story1 = { title: '', name: '', type: 'story' }
  const story2 = { title: '', name: '', type: 'story' }
  equal(compareStories(null, story1, story2), 0)
  equal(compareStories(null, story2, story1), 0)
})

test('sorts one unnamed and one named stories', () => {
  const story1 = { title: '', name: '', type: 'story' }
  const story2 = { title: '', name: 'Story', type: 'story' }
  equal(compareStories(null, story1, story2), -1)
  equal(compareStories(null, story2, story1), 1)
})

test('sorts one unnamed and one named stories with an explicit order', () => {
  const story1 = { title: '', name: '', type: 'story' }
  const story2 = { title: '', name: 'Story', type: 'story' }
  const order = { '': { story: {} } }
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
})

test('sorts stories with the same names', () => {
  const story1 = { title: '', name: 'Story', type: 'story' }
  const story2 = { title: '', name: 'Story', type: 'story' }
  equal(compareStories(null, story1, story2), 0)
  equal(compareStories(null, story2, story1), 0)
})

test('sorts without groups alphabetically without specific order', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  equal(compareStories(null, story1, story2), -1)
  equal(compareStories(null, story2, story1), 1)
})

test('sorts without groups according to a specific order', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const order = { '': { story2: {}, story1: {} } }
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
})

test('sorts in a group alphabetically without specific order', () => {
  const story1 = { title: 'Test', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test', name: 'Story2', type: 'story' }
  equal(compareStories(null, story1, story2), -1)
  equal(compareStories(null, story2, story1), 1)
})

test('sorts in a group according to a specific order', () => {
  const story1 = { title: 'Test', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test', name: 'Story2', type: 'story' }
  const order = { test: { story2: {}, story1: {} } }
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
})

test('sorts stories using names made of multiple words', () => {
  const story1 = { title: '', name: 'Story Number One', type: 'story' }
  const story2 = { title: '', name: 'Story Number Two', type: 'story' }
  const order = { '': { 'story number two': {}, 'story number one': {} } }
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
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
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
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
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
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
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
})

test('sorts with a wildcard at the first level of groups', () => {
  const story1 = { title: 'Test', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test', name: 'Story2', type: 'story' }
  const order = { '*': { story2: {}, story1: {} } }
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
})

test('sorts with a wildcard at deeper levels of groups', () => {
  const story1 = { title: 'Test/Stories', name: 'Story1', type: 'story' }
  const story2 = { title: 'Test/Stories', name: 'Story2', type: 'story' }
  const order = { '**': { story2: {}, story1: {} } }
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
})

test('sorts with a custom comparator', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const compareNames = (name1, name2) => -name1.localeCompare(name2, { numeric: true })
  equal(compareStories(null, story1, story2, { compareNames }), 1)
  equal(compareStories(null, story2, story1, { compareNames }), -1)
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
  equal(compareStories(order, story1, story2), -1)
  equal(compareStories(order, story1, story3), -1)
  equal(compareStories(order, story1, story6), -1)
  equal(compareStories(order, story2, story3), -1)
  equal(compareStories(order, story3, story4), 1)
  equal(compareStories(order, story4, story5), -1)
  equal(compareStories(order, story4, story7), 1)
  equal(compareStories(order, story5, story6), 1)
  equal(compareStories(order, story6, story7), 1)
  equal(compareStories(order, story6, story9), -1)
  equal(compareStories(order, story7, story8), -1)
  equal(compareStories(order, story8, story9), 1)
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
  equal(compareStories(order, story1, story2), -1)
  equal(compareStories(order, story1, story3), -1)
  equal(compareStories(order, story1, story10), -1)
  equal(compareStories(order, story2, story3), -1)
  equal(compareStories(order, story3, story4), 1)
  equal(compareStories(order, story3, story5), -1)
  equal(compareStories(order, story3, story6), 1)
  equal(compareStories(order, story4, story5), -1)
  equal(compareStories(order, story4, story6), -1)
  equal(compareStories(order, story4, story11), 1)
  equal(compareStories(order, story5, story10), 1)
  equal(compareStories(order, story5, story6), 1)
  equal(compareStories(order, story7, story8), 1)
  equal(compareStories(order, story7, story9), -1)
  equal(compareStories(order, story8, story9), -1)
  equal(compareStories(order, story10, story11), 1)
  equal(compareStories(order, story10, story13), -1)
  equal(compareStories(order, story11, story12), -1)
  equal(compareStories(order, story12, story13), 1)
})
