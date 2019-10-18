const executePDF = function executePDFMethod(options) {
	const _ = options.loadash;
	return new Promise(function(resolve, reject) {
		try {
			const result = { details: options.result };
			resolve(result);
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = { executePDF };
