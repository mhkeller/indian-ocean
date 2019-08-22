import csv from './csv'
import json from './json'
import psv from './psv'
import tsv from './tsv'
import txt from './txt'
import dbf from './dbf'
import {formatsList} from '../config/equivalentFormats'

let formatters = {
  csv,
  json,
  psv,
  tsv,
  txt,
  dbf
}

formatsList.forEach(format => {
  format.equivalents.forEach(equivalent => {
    formatters[equivalent] = formatters[format.name]
  })
})

export default formatters
