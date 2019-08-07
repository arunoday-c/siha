const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      resolve({
        header: options.result[0][0],
        insurance: options.result[1],
        medication: options.result[2],
        services: options.result[3]
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
