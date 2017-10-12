import discernParser from './discernParser'

// Our `readData` fns can take either a delimiter to parse a file, or a full blown parser
// Determine what they passed in with this handy function
export default function getParser (delimiterOrParser) {
  var parser
  if (typeof delimiterOrParser === 'string') {
    parser = discernParser(delimiterOrParser, {delimiter: true})
  } else if (typeof delimiterOrParser === 'function' || typeof delimiterOrParser === 'object') {
    parser = delimiterOrParser
  }
  return parser
}
