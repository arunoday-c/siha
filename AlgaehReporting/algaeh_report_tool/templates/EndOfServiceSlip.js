const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const header = options.result[0][0];
      resolve({ ...header });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
