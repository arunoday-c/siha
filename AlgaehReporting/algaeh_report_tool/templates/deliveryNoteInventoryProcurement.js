const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const utilities = new algaehUtilities();
      const header = options.result[0][0];
      const details = options.result[1];
      const subDetails = options.result[2];
      const outputArray = [];

      details.forEach(item => {
        const batches = subDetails.filter(sub => {
          return (
            sub["hims_f_procurement_dn_detail_id"] ==
            item["hims_f_procurement_dn_detail_id"]
          );
        });

        outputArray.push({ ...item, batches });
      });

      utilities.logger().log("ffff", { ...header, details: outputArray });
      resolve({ ...header, details: outputArray });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
