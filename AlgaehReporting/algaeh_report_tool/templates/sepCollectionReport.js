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

      let is_specimenRej = "";

      if (input.is_specimenRej === "R") {
        is_specimenRej = " and SA.status='R'";
      } else if (input.is_specimenRej === "A") {
        is_specimenRej = " and SA.status='A'";
      }

      options.mysql
        .executeQuery({
          query: `SELECT P.patient_code,P.full_name as pat_name,E.full_name as doc_name,INV.description,
          SA.collected,SA.collected_date,USR.user_display_name as collected_by,SA.remarks,SA.created_date,LO.ordered_date,
          case when SA.status='A' then 'Approved' when SA.status='R' then 'Rejected' else 'Pending' end as sam_status
          FROM hims_f_lab_sample as SA
          inner join hims_f_lab_order LO on LO.hims_f_lab_order_id=SA.order_id
          left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id=SA.collected_by
          inner join hims_d_investigation_test INV on INV.hims_d_investigation_test_id=LO.test_id
          left join hims_f_patient P on P.hims_d_patient_id=LO.patient_id
          left join hims_d_employee E on E.hims_d_employee_id=LO.provider_id
          where  SA.hospital_id=? and date(SA.created_date) between date(?) and date(?) ${is_specimenRej} ;`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          const result = res;
          resolve({
            result: result,
          });
        })
        .catch((e) => {
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
