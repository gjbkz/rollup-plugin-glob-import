function pseudoFileName(importee) {
	return importee
	.replace(/\*/g, '-star-')
	.replace(/[^\w-]/g, '_') + '.js';
}

module.exports = pseudoFileName;
