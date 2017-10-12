/* istanbul ignore next */
import chalk from 'chalk'

export default function (msg) {
  console.log(chalk.gray('[indian-ocean]') + ' ' + chalk.yellow('Warning:', msg))
}
