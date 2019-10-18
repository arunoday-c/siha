// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      console.log("noor", "oo");
      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.nationality_id > 0) {
        strData += ` and P.nationality_id= ${input.nationality_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select V.visit_date, P.full_name, P.patient_code,  N.nationality, \
					CASE WHEN BD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno, \
					BD.net_amout as total_before_vat, (coalesce(BD.patient_payable,0)+coalesce(BD.company_payble,0)) as total_after_vat, \
					BD.patient_tax,BD.company_tax, "Billing" as data_from from hims_f_billing_header BH \
					inner join hims_f_billing_details BD on BH.hims_f_billing_header_id = BD.hims_f_billing_header_id \
					inner join hims_f_patient P on P.hims_d_patient_id = BH.patient_id \
					inner join  hims_f_patient_visit V on BH.visit_id = hims_f_patient_visit_id \
					inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id \
					where cancelled='N' and date(bill_date) between date(?) and date(?) and BH.hospital_id=? ${strData} ;\
					select V.visit_date, P.full_name, P.patient_code, N.nationality,\
					CASE WHEN PD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno, \
					PD.net_extended_cost as total_before_vat, (coalesce(PD.patient_payable,0)+coalesce(PD.company_payable,0)) as total_after_vat, \
					PD.patient_tax,PD.company_tax,  "Pharmacy" as data_from from hims_f_pharmacy_pos_header PH \
					inner join hims_f_pharmacy_pos_detail PD on PH.hims_f_pharmacy_pos_header_id = PD.pharmacy_pos_header_id \
					left join hims_f_patient P on P.hims_d_patient_id = PH.patient_id \
					left join  hims_f_patient_visit V on PH.visit_id = hims_f_patient_visit_id \
					inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id \
					where PH.cancelled='N' and PH.posted='Y' and date(pos_date) between date(?) and date(?) and PH.hospital_id=? ${strData};`,
          values: [
            input.from_date,
            input.to_date,
            input.hospital_id,
            input.from_date,
            input.to_date,
            input.hospital_id
          ],
          printQuery: true
        })
        .then(ress => {
          let final_result = ress[0];
          final_result = final_result.concat(ress[1]);
          const result = {
            details: final_result
          };

          resolve(result);
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
