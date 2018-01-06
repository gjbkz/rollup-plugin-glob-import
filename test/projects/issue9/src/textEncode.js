import * as encoders from './encoders/*';

function textEncode(str, charset) {
	return encoders[charset](str);
}

textEncode.encoders = encoders;

export default textEncode;
