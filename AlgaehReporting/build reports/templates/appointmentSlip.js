const executePDF = function executePDFMethod(options) {
	return new Promise(function(resolve, reject) {
		try {
			resolve(options.result[0]);
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = { executePDF };
