interface WriteOptions {
	replacer?: ((key: string, value: any) => any) | (string | number)[];
	indent?: number;
	writeMethod?: 'safeDump' | 'dump';
	columns?: string[];
	callback?: (err: Error, dataString: string) => void;
}

type Formatter = (file: string, options: WriteOptions) => string;

interface ParserOptions {
	// TODO
}

type Parser = (str: string, options: ParserOptions) => any;

/* --------------------------------------------
 * Converters
 */
export function convertDbfToData(
	inFileName: string,
	outFileName: string,
	callback: (err: Error) => void
): void;

export function convertDbfToData(
	inFileName: string,
	outFileName: string,
	options: { makeDirectories: boolean },
	callback: (err: Error) => void
): void;

/* --------------------------------------------
 * Helpers
 */
export function discernFileFormatter(
	fileName: string
): Formatter;

export function discernFormat(
	fileName: string
): string;

export function discernParser(
	fileName: string,
	delimiter?: string
): Parser;

export function exists(
	fileName: string,
	callback: (err: Error, exists: boolean) => void
): void;

export function existsSync(
	fileName: string
): boolean;

export function extMatchesStr(
	fileName: string,
	extension: string
): boolean;

// export function getParser(
//   delimiterOrParser: string | (str: string, parserOptions?: /* TODO */) =>
// ): void;

export function makeDirectories(
	outPath: string,
	callback: (err: Error) => null
): void;

export function makeDirectoriesSync(
	outPath: string
): void;

export function matches(
	fileName: string,
	matcher: string | RegExp
): boolean;

export function matchesRegExp(
	fileName: string,
	regex: RegExp
): boolean;

