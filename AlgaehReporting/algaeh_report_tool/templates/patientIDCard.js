const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      resolve({ header: options.result.length == 0 ? [] : options.result[0] });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
