/* istanbul ignore next */
import dbf from '@mhkeller/dbf';

export default function (file) {
	function toBuffer(ab) {
		const buffer = new Buffer(ab.byteLength);
		const view = new Uint8Array(ab);
		for (let i = 0; i < buffer.length; i += 1) {
			buffer[i] = view[i];
		}
		return buffer;
	}
	const buf = dbf.structure(file);
	return toBuffer(buf.buffer);
}
