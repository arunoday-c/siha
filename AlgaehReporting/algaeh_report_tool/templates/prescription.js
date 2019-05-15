const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;

  return new Promise(function(resolve, reject) {
    try {
      const header = options.result.length > 0 ? options.result : [{}];
      const detail = options.result;
      let otherObj = {};
      console.log("header", header);
      const result = {
        header: { ...header[0], ...options.mainData[0] },
        detail: detail
      };

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
