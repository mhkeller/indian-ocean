import csv from './csv'
import json from './json'
import psv from './psv'
import tsv from './tsv'
import txt from './txt'
import aml from './aml'
import {formatsList} from '../config/equivalentFormats'

let parsers = {
  csv,
  json,
  psv,
  tsv,
  txt,
  aml
}

formatsList.forEach(format => {
  format.equivalents.forEach(equivalent => {
    parsers[equivalent] = parsers[format.name]
  })
})

export default parsers
