/* istanbul ignore next */
import chalk from 'chalk'

export default function (format) {
  throw new Error(chalk.red('[indian-ocean] You passed in an object but converting to ' + chalk.bold(format) + ' requires a list of objects.') + chalk.cyan('\nIf you would like to write a one-row csv, put your object in a list like so: `' + chalk.bold('[data]') + '`\n'))
}
