import discernParser from './discernParser'

// Our `readData` fns can take either a delimiter to parse a file, or a full blown parser
// Determine what they passed in with this handy function
export default function getParser (delimiterOrParser) {
  var parser
  if (typeof delimiterOrParser === 'string') {
    parser = discernParser(null, delimiterOrParser)
  } else if (typeof delimiterOrParser === 'object' || typeof delimiterOrParser === 'function') {
    parser = delimiterOrParser
  }
  return parser
}
