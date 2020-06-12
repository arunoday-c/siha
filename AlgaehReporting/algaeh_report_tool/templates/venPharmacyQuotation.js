// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
    return new Promise(function (resolve, reject) {
        try {
            // const utilities = new algaehUtilities();

            // utilities.logger().log("outpoy: ", options.result);
            const moment = options.moment;
            if (options.result.length > 0) {
                resolve({
                    vendor_quotation_number: options.result[0]["vendor_quotation_number"],
                    vendor_quotation_date: moment(options.result[0]["vendor_quotation_date"], "DD-MM-YYYY").format("DD-MM-YYYY"),
                    expected_date: moment(options.result[0]["expected_date"], "DD-MM-YYYY").format("DD-MM-YYYY"),
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
