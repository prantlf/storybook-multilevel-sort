// biome-ignore lint/performance/noDelete: this tests missing hasOwn
delete Object.hasOwn // simulate older browsers

const { strictEqual } = require('node:assert')
const test = require('tehanu')(__filename)
const { compareStories, configureSort, storySort } = require('../lib/index.cjs')

test('exports functions', () => {
  strictEqual(typeof compareStories, 'function')
  strictEqual(typeof storySort, 'function')
  strictEqual(typeof configureSort, 'function')
})

test('supports browsers without Object.hasOwn', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const order = { '': { story2: {}, story1: {} } }
  strictEqual(compareStories(order, story1, story2), 1)
  strictEqual(compareStories(order, story2, story1), -1)
})
