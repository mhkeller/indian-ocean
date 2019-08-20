// Used internally by `readdir` functions to make more DRY
/* istanbul ignore next */
import fs from 'fs'
/* istanbul ignore next */
import queue from 'd3-queue/src/queue'
import matches from '../helpers/matches'
import identity from '../utils/identity'
import {joinPath} from '../utils/path'

export default function readdir (modeInfo, dirPath, opts_, cb) {
  opts_ = opts_ || {}
  var isAsync = modeInfo.async

  // Convert to array if a string
  opts_.include = strToArray(opts_.include)
  opts_.exclude = strToArray(opts_.exclude)

  if (opts_.skipHidden === true) {
    const regex = /^\./
    if (Array.isArray(opts_.exclude)) {
      opts_.exclude.push(regex)
    } else {
      opts_.exclude = [regex]
    }
  }

  // Set defaults if not provided
  opts_.includeMatchAll = (opts_.includeMatchAll) ? 'every' : 'some'
  opts_.excludeMatchAll = (opts_.excludeMatchAll) ? 'every' : 'some'

  if (isAsync === true) {
    fs.readdir(dirPath, function (err, files) {
      if (err) {
        throw err
      }
      filter(files, cb)
    })
  } else {
    return filterSync(fs.readdirSync(dirPath))
  }

  function strToArray (val) {
    if (val && !Array.isArray(val)) {
      val = [val]
    }
    return val
  }

  function filterByType (file, cb) {
    // We need the full path so convert it if it isn't already
    var filePath = (opts_.fullPath) ? file : joinPath(dirPath, file)

    if (isAsync === true) {
      fs.stat(filePath, function (err, stats) {
        var filtered = getFiltered(stats.isDirectory())
        cb(err, filtered)
      })
    } else {
      return getFiltered(fs.statSync(filePath).isDirectory())
    }

    function getFiltered (isDir) {
      // Keep the two names for legacy reasons
      if (opts_.skipDirectories === true || opts_.skipDirs === true) {
        if (isDir) {
          return false
        }
      }
      if (opts_.skipFiles === true) {
        if (!isDir) {
          return false
        }
      }
      return file
    }
  }

  function filterByMatchers (files) {
    var filtered = files.filter(function (fileName) {
      var isExcluded
      var isIncluded

      // Don't include if matches exclusion matcher
      if (opts_.exclude) {
        isExcluded = opts_.exclude[opts_.excludeMatchAll](function (matcher) {
          return matches(fileName, matcher)
        })
        if (isExcluded === true) {
          return false
        }
      }

      // Include if matches inclusion matcher, exclude if it doesn't
      if (opts_.include) {
        isIncluded = opts_.include[opts_.includeMatchAll](function (matcher) {
          return matches(fileName, matcher)
        })
        return isIncluded
      }

      // Return true if it makes it to here
      return true
    })

    // Prefix with the full path if that's what we asked for
    if (opts_.fullPath === true) {
      return filtered.map(function (fileName) {
        return joinPath(dirPath, fileName)
      })
    }

    return filtered
  }

  function filterSync (files) {
    var filtered = filterByMatchers(files)

    return filtered.map(function (file) {
      return filterByType(file)
    }).filter(identity)
  }

  function filter (files, cb) {
    var filterQ = queue()

    var filtered = filterByMatchers(files)

    filtered.forEach(function (fileName) {
      filterQ.defer(filterByType, fileName)
    })

    filterQ.awaitAll(function (err, namesOfType) {
      cb(err, namesOfType.filter(identity))
    })
  }
}
