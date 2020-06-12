// const algaehUtilities = require("algaeh-utilities/utilities");
// const utilities = new algaehUtilities();

const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const input = options.args;
  return new Promise(function (resolve, reject) {
    try {
      const { crypto } = input;
      const header = options.result;
      let otherObj = [];

      console.log("header", header)
      for (let j = 0; j < header.length; j++) {
        const quantity = parseFloat(header[j].quantity);
        for (let i = 0; i < quantity; i++) {
          const s_price = options.currencyFormat(header[j].sales_price, crypto);
          otherObj.push({
            sales_price: s_price,
            item_description: header[j].item_description,
            print_barcode: header[j].barcode
          });
        }
      }
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
