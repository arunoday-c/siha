const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      console.log("INPUT:", input);

      //   if (input.hassanShow === "withhassan") {
      //     str += " and LO.hassan_number is not null";
      //   }
      //   if (input.hassanShow === "withOuthassan") {
      //     str += " and LO.hassan_number is null";
      //   }

      options.mysql
        .executeQuery({
          query: `select P.primary_id_no,P.patient_code,P.full_name,INV.description,LO.lab_id_number,LO.ordered_date,USR.user_display_name as batch_created_by,LBH.created_by,LBH.created_date
          from hims_f_lab_batch_detail LBD
          inner join hims_f_lab_batch_header LBH on LBH.hims_f_lab_batch_header_id=LBD.batch_header_id
          inner join hims_f_lab_order LO on LO.hims_f_lab_order_id=LBD.order_id
          inner join hims_f_patient P on P.hims_d_patient_id=LO.patient_id
          inner join hims_d_investigation_test INV on INV.hims_d_investigation_test_id=LO.test_id
          inner join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = LBH.created_by
          where LBH.hims_f_lab_batch_header_id=?;`,
          values: [input.hims_f_lab_batch_header_id],
          printQuery: true,
        })
        .then((result) => {
          resolve({
            result,
          });
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
