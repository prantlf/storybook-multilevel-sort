delete Object.hasOwn // simulate older browsers

const { equal } = require('assert')
const test = require('tehanu')(__filename)
const sort = require('../lib/index.cjs')

test('exports a function', () => {
  equal(typeof sort, 'function')
})

test('supports browsers without Object.hasOwn', () => {
  const story1 = [null, { kind: '', name: 'Story1' }]
  const story2 = [null, { kind: '', name: 'Story2' }]
  const order = { '': { story2: {}, story1: {} } };
  equal(sort(order, story1, story2), 1)
  equal(sort(order, story2, story1), -1)
})
