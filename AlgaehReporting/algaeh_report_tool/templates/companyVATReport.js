// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.nationality_id > 0) {
        strData += ` and P.nationality_id=${input.nationality_id}`;
      }
      if (input.primary_sub_id > 0) {
        strData += ` and PI.primary_sub_id=${input.primary_sub_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select bill_number as doc_number, V.visit_date, P.full_name, P.patient_code,  N.nationality, \
					CASE WHEN BD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno, \
					BD.net_amout, BD.comapany_resp as total_before_vat, BD.company_payble as total_after_vat, \
					BD.patient_tax,BD.company_tax, "Billing" as data_from, IP.insurance_sub_name from hims_f_billing_header BH \
					inner join hims_f_billing_details BD on BH.hims_f_billing_header_id = BD.hims_f_billing_header_id \
					inner join hims_f_patient P on P.hims_d_patient_id = BH.patient_id \
          inner join  hims_f_patient_visit V on BH.visit_id = hims_f_patient_visit_id \
          inner join  hims_m_patient_insurance_mapping PI on BH.visit_id = PI.patient_visit_id \
          inner join  hims_d_insurance_sub IP on PI.primary_sub_id = IP.hims_d_insurance_sub_id \
					inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id \
					where adjusted='N' and cancelled='N' and BD.insurance_yesno='Y' and date(bill_date) between date(?) and date(?) and BH.hospital_id=? ${strData} ;\
					select pos_number as doc_number, V.visit_date, P.full_name, P.patient_code, N.nationality,\
					CASE WHEN PD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno, \
					PD.net_extended_cost, PD.company_responsibility as total_before_vat, PD.company_payable as total_after_vat, \
					PD.patient_tax,PD.company_tax,  "Pharmacy" as data_from, IP.insurance_sub_name from hims_f_pharmacy_pos_header PH \
					inner join hims_f_pharmacy_pos_detail PD on PH.hims_f_pharmacy_pos_header_id = PD.pharmacy_pos_header_id \
					left join hims_f_patient P on P.hims_d_patient_id = PH.patient_id \
					left join  hims_f_patient_visit V on PH.visit_id = hims_f_patient_visit_id \
          inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id \
          inner join  hims_m_patient_insurance_mapping PI on PH.visit_id = PI.patient_visit_id \
          inner join  hims_d_insurance_sub IP on PI.primary_sub_id = IP.hims_d_insurance_sub_id \
					where PH.cancelled='N' and PD.insurance_yesno='Y' and  PH.posted='Y' and date(pos_date) between date(?) and date(?) and PH.hospital_id=? ${strData};`,
          values: [
            input.from_date,
            input.to_date,
            input.hospital_id,
            input.from_date,
            input.to_date,
            input.hospital_id,
          ],
          printQuery: true,
        })
        .then((ress) => {
          let final_result = ress[0];
          final_result = final_result.concat(ress[1]);
          const result = {
            details: final_result,
            total_before_vat: options.currencyFormat(
              _.sumBy(final_result, (s) => parseFloat(s.total_before_vat)),
              options.args.crypto
            ),
            total_after_vat: options.currencyFormat(
              _.sumBy(final_result, (s) => parseFloat(s.total_after_vat)),
              options.args.crypto
            ),
            patient_tax: options.currencyFormat(
              _.sumBy(final_result, (s) => parseFloat(s.patient_tax)),
              options.args.crypto
            ),
            company_tax: options.currencyFormat(
              _.sumBy(final_result, (s) => parseFloat(s.company_tax)),
              options.args.crypto
            ),
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
