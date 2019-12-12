// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
    return new Promise(function (resolve, reject) {
        try {
            // const utilities = new algaehUtilities();

            // utilities.logger().log("outpoy: ", options.result);

            if (options.result.length > 0) {
                resolve({
                    vendor_quotation_number: options.result[0]["vendor_quotation_number"],
                    vendor_quotation_date: options.result[0]["vendor_quotation_date"],
                    expected_date: options.result[0]["expected_date"],
                    vendor_name: options.result[0]["vendor_name"],
                    quotation_number: options.result[0]["quotation_number"],
                    detailList: options.result
                });
            } else {
                resolve({ detailList: options.result });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = { executePDF };
