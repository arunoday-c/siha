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

      let is_orderedType = "";

      if (input.is_orderedType === "R") {
        is_orderedType = "TIMEDIFF(LO.validated_date,LS.collected_date) as TAT";
      } else if (input.is_orderedType === "S") {
        is_orderedType = " TIMEDIFF(LS.collected_date,LO.ordered_date) as TAT";
      }

      let is_reRun = "";

      if (input.is_reRun === "N") {
        is_reRun = " and LO.run_type='N'";
      } else if (input.is_reRun === "1") {
        is_reRun = " and LO.run_type='1'";
      } else if (input.is_reRun === "2") {
        is_reRun = " and LO.run_type='2'";
      } else if (input.is_reRun === "3") {
        is_reRun = " and LO.run_type='3'";
      }

      options.mysql
        .executeQuery({
          query: `SELECT PT.patient_code,PT.full_name as pat_name,EM.full_name as doc_name,
          SR.service_name,LO.lab_id_number, LO.test_type,LO.bacteria_type,LO.ordered_date,
          LS.collected_date,LO.entered_date,LO.confirmed_date,LO.validated_date,
          case when LO.run_type='1' then '1 Time' when LO.run_type='2' then '2 Times' when LO.run_type='3' then '3 times' else '-' end as run_type,
            ${is_orderedType}
            FROM hims_f_lab_order as LO
            inner join hims_f_patient PT on LO.patient_id = PT.hims_d_patient_id
            inner join hims_f_patient_visit VS on LO.visit_id = VS.hims_f_patient_visit_id
            inner join hims_d_employee EM on LO.provider_id = EM.hims_d_employee_id
            inner join hims_d_services SR on LO.service_id = SR.hims_d_services_id
            inner join hims_f_lab_sample LS ON LO.hims_f_lab_order_id = LS.order_id
            where LO.billed='Y' and date(LO.ordered_date) between date(?) and date(?) and LO.hospital_id=? and LO.test_type = ? ${is_reRun};`,
          values: [
            input.from_date,
            input.to_date,
            input.hospital_id,
            input.is_orderedType,
          ],
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
