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
          query: `SELECT LO.hims_f_lab_order_id,P.patient_code,P.full_name,P.primary_id_no,LO.lab_id_number,INS.primary_insurance_provider_id,INS.primary_sub_id,INS.primary_network_id
            FROM hims_f_lab_order LO
            inner join hims_f_patient P on P.hims_d_patient_id=LO.patient_id
            left join hims_m_patient_insurance_mapping INS on INS.patient_visit_id = LO.visit_id
            where date(LO.updated_date)=date(?) and INS.primary_sub_id=? and LO.status='CL';`,

          values: [input.from_date, input.hims_d_insurance_sub_id],
          printQuery: true,
        })
        .then((result) => {
          let lab_ids = result.map((item) => item.hims_f_lab_order_id);
          if (lab_ids.length === 0) {
            lab_ids = null;
          }
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
              //             SELECT LO.hims_f_lab_order_id,P.patient_code,P.full_name,P.primary_id_no,LO.lab_id_number,INS.primary_insurance_provider_id,INS.primary_sub_id,INS.primary_network_id
              // FROM hims_f_lab_order LO
              // inner join hims_f_patient P on P.hims_d_patient_id=LO.patient_id
              // left join hims_m_patient_insurance_mapping INS on INS.patient_visit_id = LO.visit_id
              // where date(LO.updated_date)=date();

              values: [lab_ids],
              printQuery: true,
            })
            .then((result) => {
              console.log("result", result);
              // const header = result.length ? result[0] : {};
              resolve({ header: result });
            })
            .catch((error) => {
              options.mysql.releaseConnection();
            });
          // const header = result.length ? result[0] : {};
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
