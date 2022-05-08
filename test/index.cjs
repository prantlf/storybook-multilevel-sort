const { equal } = require('assert')
const test = require('tehanu')(__filename)
const sort = require('../lib/index.cjs')

test('exports a function', () => {
  equal(typeof sort, 'function')
})
