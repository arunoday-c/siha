const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      resolve({
        patient_code: options.result[0][0]["patient_code"],
        patient_name: options.result[0][0]["patient_name"],
        doctor_name: options.result[0][0]["doctor_name"],
        ordered_date: options.result[1][0]["ordered_date"],
        specimen: options.result[1][0]["specimen"],
        service_name: options.result[1][0]["service_name"],
        bacteria_type: options.result[1][0]["bacteria_type"],
        organism_type: options.result[1][0]["organism_type"],
        bacteria_name: options.result[1][0]["bacteria_name"],
        validated_by: options.result[1][0]["validated_by"],
        comments: options.result[1][0]["comments"],
        details: options.result[1]
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
