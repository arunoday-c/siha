const executePDF = function executePDFMethod(options) {
	const _ = options.loadash;
	return new Promise(function(resolve, reject) {
		try {
			const result = _.chain(options.result)
				.groupBy((g) => g.status)
				.map(function(dtl, key) {
					return {
						status: key,
						detailList: dtl
					};
				})
				.value();
			//const result = { detailList: options.result };

			resolve({ detail: result });
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = { executePDF };
