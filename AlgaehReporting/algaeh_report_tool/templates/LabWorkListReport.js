const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      // let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          SELECT LO.lab_id_number,LO.hims_f_lab_order_id,LO.test_type,P.patient_code,P.primary_id_no,P.full_name,
          P.gender,V.visit_code,V.age_in_years,V.age_in_months,V.age_in_days,B.bill_number,B.bill_date,LO.confirmed_date,INV.description,
          case when  S.status='N' then 'Pending' when S.status='A' then 'Accepted' else 'Rejected' end as specimen_status, 
          case when LO.status='O' then 'Ordered' when LO.status='CL' then 'Sample Collected' when LO.status='CN' then 'Test Cancelled' 
          when LO.status='CF' then 'Result Confirmed' else 'Result Validated' end as test_status
          FROM hims_f_lab_order LO 
          inner join hims_f_lab_sample S on S.order_id = LO.hims_f_lab_order_id
          inner join hims_f_patient as P on P.hims_d_patient_id = LO.patient_id
          inner join hims_f_patient_visit as V on V.hims_f_patient_visit_id = LO.visit_id
          inner join hims_f_billing_header as B on B.hims_f_billing_header_id = LO.billing_header_id
          inner join hims_d_investigation_test as INV on INV.hims_d_investigation_test_id = LO.test_id
          where LO.patient_id=? and LO.visit_id=? and LO.billed='Y' order by LO.lab_id_number asc;
            `,
          values: [input.hims_d_patient_id, input.visit_id],
          printQuery: true,
        })
        .then((result) => {
          const final = {
            header: { ..._.head(result), ..._.head(options.mainData) },
            detail: result,
          };
          resolve(final);
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
