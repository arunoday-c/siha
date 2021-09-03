const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `SELECT INV.description,LS.barcode_gen,LO.lab_id_number,P.date_of_birth, P.full_name,P.patient_code, 
                age_in_years, age_in_months,age_in_days,gender,LC.color_name,LC.color_code 
                FROM  hims_f_lab_order LO 
                inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id 
                inner join hims_f_patient P on P.hims_d_patient_id = LO.patient_id 
                inner join hims_f_patient_visit V on LO.visit_id = V.hims_f_patient_visit_id
                inner join hims_d_investigation_test INV on INV.hims_d_investigation_test_id=LO.test_id
                inner join hims_d_lab_container LC on LC.hims_d_lab_container_id=LS.container_id
                where LO.hims_f_lab_order_id in (?);`,

          values: [input.hims_f_lab_order_id],
          printQuery: true,
        })
        .then((result) => {
          console.log("result", result);

          resolve({ header: result });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };

// const executePDF = function executePDFMethod(options) {
//   return new Promise(function (resolve, reject) {
//     try {
//       resolve({ header: options.result.length ? options.result[0] : [] });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
// module.exports = { executePDF };
