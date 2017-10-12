/* istanbul ignore next */
import chalk from 'chalk'

export default function (format) {
  throw new Error(chalk.red('[indian-ocean] Error converting your data to ' + chalk.bold(format) + '.') + '\n\n' + chalk.cyan('Your data most likely contains objects or lists. Object values can only be strings for this format. Please convert before writing to file.\n'))
}
