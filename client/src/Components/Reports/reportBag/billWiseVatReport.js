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
        strData += ` and P.nationality_id= ${input.nationality_id}`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT BH.bill_number as doc_number,V.visit_date, P.full_name, P.patient_code,  N.nationality,CASE WHEN BD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno,"Billing" as data_from, BD.net_amout as total_before_vat,BD.patient_tax,BD.company_tax,(coalesce(BD.patient_payable,0)+coalesce(BD.company_payble,0)) as total_after_vat, S.service_name
            FROM hims_f_billing_details as BD
            left join hims_f_billing_header BH on BD.hims_f_billing_header_id = BH.hims_f_billing_header_id
            inner join hims_f_patient P on P.hims_d_patient_id = BH.patient_id
            inner join  hims_f_patient_visit V on BH.visit_id = hims_f_patient_visit_id
            inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
            inner join hims_d_services S on BD.services_id=S.hims_d_services_id
            where BD.cancel_yes_no='N' and date(BH.bill_date) between date(?) and date(?) and BH.hospital_id=? ${strData};\
            SELECT PH.pos_number as doc_number,V.visit_date, P.full_name, P.patient_code, N.nationality,CASE WHEN PD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno,"Pharmacy" as data_from,PD.net_extended_cost as total_before_vat, (coalesce(PD.patient_payable,0)+coalesce(PD.company_payable,0)) as total_after_vat, PD.patient_tax,PD.company_tax,S.service_name
            FROM hims_f_pharmacy_pos_detail as PD
            left join hims_f_pharmacy_pos_header PH on PD.pharmacy_pos_header_id = PH.hims_f_pharmacy_pos_header_id
            left join hims_f_patient P on P.hims_d_patient_id = PH.patient_id
            left join  hims_f_patient_visit V on PH.visit_id = hims_f_patient_visit_id
            inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
            inner join hims_d_services S on PD.service_id=S.hims_d_services_id
            where PH.cancelled='N' and PH.posted='Y' and date(PH.pos_date) between date(?) and date(?) and PH.hospital_id=? ${strData};`,
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
          console.log("final_result", final_result);

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
