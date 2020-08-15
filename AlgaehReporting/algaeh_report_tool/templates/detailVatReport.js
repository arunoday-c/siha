// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.nationality_id > 0) {
        strData += ` and P.nationality_id= ${input.nationality_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select BH.hims_f_billing_header_id, BH.patient_id, BH.visit_id, P.full_name, P.patient_code,  N.nationality, BH.bill_number, date(BH.bill_date) as bill_date,  BH.patient_res, BH.company_res, BH.cancelled,
(coalesce(BC.total_tax, 0)) as cancelled_tax,
(BH.net_total - (coalesce(BC.net_total, 0))) as actual_total_before_vat,
(BH.net_amount - (coalesce(BC.net_amount, 0))) as actual_total_after_vat,
(BH.patient_tax - (coalesce(BC.patient_tax , 0))) as actual_pat_tax,
(BH.company_tax - (coalesce(BC.company_tax , 0))) as actual_com_tax,
(BH.total_tax - (coalesce(BC.total_tax, 0))) as actual_tax
from hims_f_billing_header as BH
  inner join hims_f_patient P on P.hims_d_patient_id = BH.patient_id
inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
left outer join hims_f_bill_cancel_header BC on BH.hims_f_billing_header_id = BC.from_bill_id
where BH.cancelled <> 'Y' and BH.total_tax > 0  and date(BH.bill_date) between date(?) and date(?) and BH.hospital_id=? ${strData};`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((ress) => {
          let final_result = ress;
          // final_result = final_result.concat(ress[1]);
          const result = {
            details: final_result,
          };

          resolve(result);
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
