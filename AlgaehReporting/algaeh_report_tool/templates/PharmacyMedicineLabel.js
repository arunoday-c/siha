const executePDF = function executePDFMethod(options) {
  // const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      // console.log("detail", detail);
      // const header = options.result[0].length > 0 ? options.result[0] : [{}];
      // console.log("header", header);
      const result = {
        contentData: options.result.length > 0 ? options.result : []
      };
      // const result = options.result.length > 0 ? options.result : [];

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
