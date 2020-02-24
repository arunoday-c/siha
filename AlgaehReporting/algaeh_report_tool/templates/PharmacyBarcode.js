// const algaehUtilities = require("algaeh-utilities/utilities");
// const utilities = new algaehUtilities();

const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  // const input = options.args;
  return new Promise(function(resolve, reject) {
    try {
      const header = options.result[0];
      let otherObj = [];
      // const newMeasurement = options.convertMilimetersToPixel(input.others);

      const quantity = parseFloat(header.quantity);
      for (let i = 0; i < quantity; i++) {
        otherObj.push({
          barcode: header.barcode,
          sales_price: header.sales_price
          // width: newMeasurement.width,
          // height: newMeasurement.height
        });
        // utilities.logger().log("loop: ", otherObj);
      }
      // utilities.logger().log("otherObj: ", otherObj);
      const result = {
        header: otherObj
      };
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
