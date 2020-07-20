const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      console.log("result: ", options.result[0])
      resolve({ header: options.result[0] });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
