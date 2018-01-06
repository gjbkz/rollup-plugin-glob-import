import textEncode from './textEncode.js';
import result from './result.js';

result.push(textEncode('foo', 'cp1250'));
result.push(textEncode('bar', 'cp1251'));

result.push(textEncode.encoders);
