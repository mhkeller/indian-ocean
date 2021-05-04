export default function parseTxt(str, parserOptions) {
	return (parserOptions && typeof parserOptions.map === 'function') ? parserOptions.map(str) : str;
}
