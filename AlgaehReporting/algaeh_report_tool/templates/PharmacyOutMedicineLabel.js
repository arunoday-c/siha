const executePDF = function executePDFMethod(options) {
  // const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      const result = options.result.length > 0 ? options.result[0] : []
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
