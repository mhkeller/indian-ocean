import * as io from './index.node.js'

const test = io.readdirFilterSync('test/data/recursive', {
  fullPath: true,
  // recursive: true,
  include: 'csv'
})

console.log(test)
