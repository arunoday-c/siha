// const algaehUtilities = require("algaeh-utilities/utilities");
// const utilities = new algaehUtilities();

const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const input = options.args;
  return new Promise(function(resolve, reject) {
    try {
      const { crypto } = input;
      const header = options.result[0];
      let otherObj = [];

      const quantity = parseFloat(header.quantity);
      for (let i = 0; i < quantity; i++) {
        const s_price = options.currencyFormat(header.sales_price, crypto);
        otherObj.push({
          sales_price: s_price,
          item_description: header.item_description,
          print_barcode: header.barcode
        });
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
