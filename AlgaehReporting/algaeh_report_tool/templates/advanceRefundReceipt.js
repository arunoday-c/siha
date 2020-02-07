const executePDF = function executePDFMethod(options) {
  // const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      const { reportParams } = options.args;

      // const header = options.result[0].length > 0 ? options.result[0] : [{}];
      // console.log("header", header);
      let dataObject = {};
      for (let i = 0; i < reportParams.length; i++) {
        const { name, value } = reportParams[i];
        dataObject[name] = value;
      }
      const result = dataObject;
      // const result = options.result.length > 0 ? options.result : [];

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
