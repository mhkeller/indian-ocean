/* istanbul ignore next */
import chalk from 'chalk';

export default function warn(msg) {
	console.log(`${chalk.gray('[indian-ocean]')} ${chalk.yellow('Warning:', msg)}`);
}
