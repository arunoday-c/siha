// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
    return new Promise(function (resolve, reject) {

        try {
            const moment = options.moment;
            // const utilities = new algaehUtilities();

            // utilities.logger().log("outpoy: ", options.result);

            if (options.result.length > 0) {
                resolve({
                    quotation_number: options.result[0]["quotation_number"],
                    quotation_date: moment(options.result[0]["quotation_date"], "DD-MM-YYYY").format("DD-MM-YYYY"),
                    expected_date: moment(options.result[0]["expected_date"], "DD-MM-YYYY").format("DD-MM-YYYY"),
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
