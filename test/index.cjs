delete Object.hasOwn // simulate older browsers

const { equal } = require('assert')
const test = require('tehanu')(__filename)
const { compareStories } = require('../lib/index.cjs')

test('exports a function', () => {
  equal(typeof compareStories, 'function')
})

test('supports browsers without Object.hasOwn', () => {
  const story1 = { title: '', name: 'Story1', type: 'story' }
  const story2 = { title: '', name: 'Story2', type: 'story' }
  const order = { '': { story2: {}, story1: {} } }
  equal(compareStories(order, story1, story2), 1)
  equal(compareStories(order, story2, story1), -1)
})
