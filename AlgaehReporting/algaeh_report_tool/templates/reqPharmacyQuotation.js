// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
    return new Promise(function (resolve, reject) {
        try {
            // const utilities = new algaehUtilities();

            // utilities.logger().log("outpoy: ", options.result);

            if (options.result.length > 0) {
                resolve({
                    quotation_number: options.result[0]["quotation_number"],
                    quotation_date: options.result[0]["quotation_date"],
                    expected_date: options.result[0]["expected_date"],
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
