// const algaehUtilities = require("algaeh-utilities/utilities");
// const utilities = new algaehUtilities();
// utilities.logger().log("input: ", input);
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      // utilities.logger().log("otpuuu: ", options.result);
      resolve({
        material_requisition_number:
          options.result[0].material_requisition_number,
        hospital_name: options.result[0].hospital_name,
        requistion_type: options.result[0].requistion_type,
        from_location: options.result[0].from_location,
        requistion_date: options.result[0].requistion_date,
        to_location: options.result[0].to_location,
        details: options.result
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
