// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      // const utilities = new algaehUtilities();

      const header = options.result[0][0];
      const details = options.result[1];
      const allBatches = options.result[2];
      const outputArray = [];
      const _ = options.loadash;

      details.forEach(item => {
        item
        const batches = allBatches.filter(bat => {
          return (
            bat["transfer_detail_id"] ==
            item["hims_f_inventory_transfer_detail_id"]
          );
        });
        console.log("item.qty_transfer", batches)
        item.qty_transfer = _.sumBy(batches, s => parseFloat(s.quantity_transfer))
        console.log("qty_transfer", item.qty_transfer)
        outputArray.push({ ...item, batches });
      });

      // utilities.logger().log("ffff", { ...header, details: outputArray });
      resolve({ ...header, details: outputArray });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
