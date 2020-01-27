// const algaehUtilities = require("algaeh-utilities/utilities");
// const utilities = new algaehUtilities();
// utilities.logger().log("input: ", input);
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
     
      if(options.result.length ===0)
{
  resolve({header:{},details:[]});
  return;
}      // utilities.logger().log("otpuuu: ", options.result);
      //{"header":${JSON.stringify({...result[0][0],...result[1][0]})},"details":${JSON.stringify(groupBy(result[1],"hims_d_lab_specimen_id"))}}
    
    const _ =  options.loadash;
   const details=  _.chain(options.result[1])
     .groupBy(g=>g.hims_d_lab_specimen_id)
     .map(function(detail, key) {
       return {
         "hims_d_lab_specimen_id": key,
         groupDetail: detail
       };
     })
     .value();
     const result= {
      header:  {...options.result[0][0],...options.result[1][0]},
      details:details
     }
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
