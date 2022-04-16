import { equal } from 'assert'
import tehanu from 'tehanu'
import sort from './index.js'

const test = tehanu('sort')

test('sort unnamed stories', () => {
  const story1 = [null, { kind: '', name: '' }]
  const story2 = [null, { kind: '', name: '' }]
  equal(sort(null, story1, story2), 0)
  equal(sort(null, story2, story1), 0)
})

test('sort one unnamed and one named stories', () => {
  const story1 = [null, { kind: '', name: '' }]
  const story2 = [null, { kind: '', name: 'Story' }]
  equal(sort(null, story1, story2), -1)
  equal(sort(null, story2, story1), 1)
})

test('sort one unnamed and one named stories with an explicit order', () => {
  const story1 = [null, { kind: '', name: '' }]
  const story2 = [null, { kind: '', name: 'Story' }]
  const order = { '': { story: {} } };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})

test('sort without groups alphabetically without specific order', () => {
  const story1 = [null, { kind: '', name: 'Story1' }]
  const story2 = [null, { kind: '', name: 'Story2' }]
  equal(sort(null, story1, story2), -1)
  equal(sort(null, story2, story1), 1)
})

test('sort without groups according to a specific order', () => {
  const story1 = [null, { kind: '', name: 'Story1' }]
  const story2 = [null, { kind: '', name: 'Story2' }]
  const order = { '': { story2: {}, story1: {} } };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})

test('sort in a group alphabetically without specific order', () => {
  const story1 = [null, { kind: 'Test', name: 'Story1' }]
  const story2 = [null, { kind: 'Test', name: 'Story2' }]
  equal(sort(null, story1, story2), -1)
  equal(sort(null, story2, story1), 1)
})

test('sort in a group according to a specific order', () => {
  const story1 = [null, { kind: 'Test', name: 'Story1' }]
  const story2 = [null, { kind: 'Test', name: 'Story2' }]
  const order = { test: { story2: {}, story1: {} } };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})

test('sort groups at the second level', () => {
  const story1 = [null, { kind: 'First/Second1', name: 'Story' }]
  const story2 = [null, { kind: 'First/Second2', name: 'Story' }]
  const order = {
    first: {
      second2: {},
      second1: {}
    }
  };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})

test('sort groups at the third level', () => {
  const story1 = [null, { kind: 'First/Second/Third1', name: 'Story' }]
  const story2 = [null, { kind: 'First/Second/Third2', name: 'Story' }]
  const order = {
    first: {
      second: {
        third2: {},
        third1: {}
      }
    }
  };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})

test('sort stories at the third level', () => {
  const story1 = [null, { kind: 'First/Second', name: 'Story1' }]
  const story2 = [null, { kind: 'First/Second', name: 'Story2' }]
  const order = {
    first: {
      second: {
        story2: {},
        story1: {}
      }
    }
  };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})

test('sort with a wildcard at the first level of groups', () => {
  const story1 = [null, { kind: 'Test', name: 'Story1' }]
  const story2 = [null, { kind: 'Test', name: 'Story2' }]
  const order = { '*': { story2: {}, story1: {} } };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})

test('sort complex example', () => {
  const story1 = [null, { kind: 'Articles', name: 'Getting Started' }]
  const story2 = [null, { kind: 'Articles', name: 'Versioning' }]
  const story3 = [null, { kind: 'Components/Header', name: 'Collapsed' }]
  const story4 = [null, { kind: 'Components/Header', name: 'Default' }]
  const story5 = [null, { kind: 'Components/Header', name: 'Expanded' }]
  const story6 = [null, { kind: 'Elements/Button', name: 'Active' }]
  const story7 = [null, { kind: 'Elements/Button', name: 'Default' }]
  const story8 = [null, { kind: 'Elements/Link', name: 'Active' }]
  const story9 = [null, { kind: 'Elements/Link', name: 'Default' }]
  const order = {
    articles: {},
    elements: {
      '*': { default: null, },
    },
    components: {
      '*': { default: null, },
    },
  };
  equal(sort(order, story1, story2), -1)
  equal(sort(order, story1, story3), -1)
  equal(sort(order, story1, story6), -1)
  equal(sort(order, story2, story3), -1)
  equal(sort(order, story3, story4), 1)
  equal(sort(order, story4, story5), -1)
  equal(sort(order, story4, story7), 1)
  equal(sort(order, story5, story6), 1)
  equal(sort(order, story6, story7), 1)
  equal(sort(order, story6, story9), -1)
  equal(sort(order, story7, story8), -1)
  equal(sort(order, story8, story9), 1)
})
