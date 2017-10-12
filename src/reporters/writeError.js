/* istanbul ignore next */
import chalk from 'chalk'

export default function (format, msg) {
  throw new Error(chalk.red('[indian-ocean] Error writing your data to ' + chalk.bold(format) + '.') + '\n\n' + msg)
}
