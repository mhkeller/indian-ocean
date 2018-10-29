import * as io from './index.node.js'

const test = io.readdirFilterSync('test/data/recursive', { recursive: true, include: 'csv' })

console.log(test)
