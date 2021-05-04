// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

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

      options.mysql
        .executeQuery({
          query: `SELECT BH.bill_number as doc_number,V.visit_date, P.hims_d_patient_id as patient_id,P.full_name, P.patient_code,  N.nationality,
          CASE WHEN BD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno,"Billing" as data_from, 
          BD.net_amout as total_before_vat,BD.total_tax,BD.patient_tax,BD.company_tax,(coalesce(BD.patient_payable,0)+coalesce(BD.company_payble,0)) as total_after_vat, S.service_name,BH.hims_f_billing_header_id as bill_id, SI.insurance_sub_name as company_name
            FROM hims_f_billing_details as BD
            left join hims_f_billing_header BH on BD.hims_f_billing_header_id = BH.hims_f_billing_header_id
            inner join hims_f_patient P on P.hims_d_patient_id = BH.patient_id
            inner join  hims_f_patient_visit V on BH.visit_id = hims_f_patient_visit_id
            inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
            inner join hims_d_services S on BD.services_id=S.hims_d_services_id
            left join hims_m_patient_insurance_mapping PI on BH.visit_id = PI.patient_visit_id
            left join hims_d_insurance_sub SI on PI.primary_sub_id = SI.hims_d_insurance_sub_id
            where BD.cancel_yes_no='N' and adjusted='N' and date(BH.bill_date) between date(?) and date(?) and BH.hospital_id=? ${strData};\
            SELECT PH.pos_number as doc_number,V.visit_date, P.hims_d_patient_id as patient_id,P.full_name, P.patient_code, N.nationality,CASE WHEN PD.insurance_yesno='Y' THEN 'Insurance' else 'Cash' END as insurance_yesno,"Pharmacy" as data_from,PD.net_extended_cost as total_before_vat, (coalesce(PD.patient_payable,0)+coalesce(PD.company_payable,0)) as total_after_vat, PD.patient_tax,PD.company_tax,S.service_name,PH.hims_f_pharmacy_pos_header_id as bill_id, SI.insurance_sub_name as company_name
            FROM hims_f_pharmacy_pos_detail as PD
            left join hims_f_pharmacy_pos_header PH on PD.pharmacy_pos_header_id = PH.hims_f_pharmacy_pos_header_id
            left join hims_f_patient P on P.hims_d_patient_id = PH.patient_id
            left join  hims_f_patient_visit V on PH.visit_id = hims_f_patient_visit_id
            inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
            inner join hims_d_services S on PD.service_id=S.hims_d_services_id
            left join hims_m_patient_insurance_mapping PI on PH.visit_id = PI.patient_visit_id
            left join hims_d_insurance_sub SI on PI.primary_sub_id = SI.hims_d_insurance_sub_id
            where PH.cancelled='N' and PH.posted='Y'  and date(PH.pos_date) between date(?) and date(?) and PH.hospital_id=? ${strData};`,
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
          const BillWise = _.chain(final_result)
            .groupBy((g) => g.bill_id)
            .map((billNo) => {
              const {
                doc_number,
                visit_date,
                full_name,
                patient_code,
                nationality,
                company_name,
              } = billNo[0];
              const patientList = _.chain(billNo)
                .groupBy((g) => g.patient_id)
                .map((docs) => {
                  // const { full_name, patient_code } = docs[0];
                  return {
                    full_name,
                    patient_code,
                    docs: docs.map((n) => {
                      return {
                        ...n,
                      };
                    }),
                  };
                })
                // .sortBy((s) => s.bill_date)
                .value();

              return {
                doc_number,
                visit_date,
                full_name,
                patient_code,
                nationality,
                company_name,
                patientList: patientList,
              };
            })
            .value();

          resolve({
            result: BillWise,

            sum_total_before_vat: _.sumBy(final_result, (s) =>
              parseFloat(s.total_before_vat)
            ),
            sum_total_tax: _.sumBy(final_result, (s) =>
              parseFloat(s.total_tax)
            ),
            sum_total_after_vat: _.sumBy(final_result, (s) =>
              parseFloat(s.total_after_vat)
            ),
            sum_patient_tax: _.sumBy(final_result, (s) =>
              parseFloat(s.patient_tax)
            ),
            sum_company_tax: _.sumBy(final_result, (s) =>
              parseFloat(s.company_tax)
            ),
            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
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
