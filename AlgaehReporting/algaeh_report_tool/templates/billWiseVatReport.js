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

      if (input.is_Insurance == "Y") {
        strData += ` and V.insured='Y'`;
      } else if (input.is_Insurance == "N") {
        strData += ` and V.insured='N'`;
      }
      console.log("input=", input);

      options.mysql
        .executeQuery({
          query: `
          select BH.bill_number as doc_number,V.visit_date, P.full_name, P.patient_code,  N.nationality,
          case when INS.insurance_sub_name is NULL then 'Cash' else INS.insurance_sub_name end as insurance_sub_name,
          BH.net_total as total_before_vat, BH.net_amount as total_after_vat,
          BH.patient_tax,BH.company_tax, "Billing" as data_from 
          from hims_f_billing_header BH
          inner join hims_f_patient P on P.hims_d_patient_id = BH.patient_id
          inner join hims_f_patient_visit V on hims_f_patient_visit_id = BH.visit_id
          inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
          left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id = BH.visit_id
          left join hims_d_insurance_sub INS on INS.hims_d_insurance_sub_id = IM.primary_sub_id
          where cancelled='N' and adjusted='N' and date(bill_date) between date(?) and date(?) and BH.hospital_id=? ${strData} ;
          select PH.pos_number as doc_number,V.visit_date, P.full_name, P.patient_code, N.nationality,
          case when INS.insurance_sub_name is NULL then 'Cash' else INS.insurance_sub_name end as insurance_sub_name,
          PH.net_total as total_before_vat, PH.net_amount as total_after_vat,
          PH.patient_tax,PH.company_tax,  "Pharmacy" as data_from 
          from hims_f_pharmacy_pos_header PH
          left join hims_f_patient P on P.hims_d_patient_id = PH.patient_id
          left join  hims_f_patient_visit V on PH.visit_id = hims_f_patient_visit_id
          inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
          left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id = PH.visit_id
          left join hims_d_insurance_sub INS on INS.hims_d_insurance_sub_id = IM.primary_sub_id
          where PH.cancelled='N' and PH.posted='Y' and date(pos_date) between date(?) and date(?) and PH.hospital_id=? ${strData};`,
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
          // console.log("final_result", final_result);

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
