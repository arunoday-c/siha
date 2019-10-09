const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      if (options.result.length > 0) {
        resolve({
          employee_code: options.result[0].employee_code,
          full_name: options.result[0].full_name,
          consumption_number: options.result[0].consumption_number,
          consumption_date: options.result[0].consumption_date,

          location_description: options.result[0].location_description,
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
