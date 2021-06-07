// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // if (input.item_id.length > 0) {
      //   str += ` and BD.services_id in (${input.hims_d_services_ids}) `;
      // }

      // if (input.item_id > 0) {
      //   strData += ` and BD.services_id= ${input.item_id}`;
      // }

      options.mysql
        .executeQuery({
          query: `
          SELECT IH.hims_f_invoice_header_id,IH.policy_number,IH.invoice_number,IH.invoice_date,PAT.patient_code,PAT.full_name,S.service_code,S.service_name,SUB.insurance_sub_name,
          ID.gross_amount,ID.patient_payable,ID.patient_tax,ID.patient_resp,ID.company_resp,S.vat_percent,ID.company_tax,ID.company_payable
          FROM hims_f_invoice_header IH
          inner join hims_f_invoice_details as ID on ID.invoice_header_id = IH.hims_f_invoice_header_id
          inner join hims_f_patient as PAT on PAT.hims_d_patient_id = IH.patient_id
          inner join hims_d_services as S on S.hims_d_services_id = ID.service_id
          inner join hims_f_insurance_statement as INS on 
          INS.hims_f_insurance_statement_id = IH.insurance_statement_id  or 
          INS.hims_f_insurance_statement_id = IH.insurance_statement_id_2 or 
          INS.hims_f_insurance_statement_id  = IH.insurance_statement_id_3
          inner join hims_d_insurance_sub as SUB on SUB.hims_d_insurance_sub_id = IH.sub_insurance_id
          where (IH.insurance_statement_id =? or IH.insurance_statement_id_2=? or IH.insurance_statement_id_3=?);`,
          values: [input.item_id, input.item_id, input.item_id],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.hims_f_invoice_header_id)
            .map(function (dtl, key) {
              const {
                policy_number,
                invoice_number,
                invoice_date,
                patient_code,
                full_name,
                insurance_sub_name,
              } = dtl[0];
              return {
                hims_f_invoice_header_id: key,
                policy_number,
                invoice_number,
                invoice_date,
                patient_code,
                full_name,
                insurance_sub_name,
                detailList: dtl,
                total_gross_amount: _.sumBy(dtl, (s) =>
                  parseFloat(s.gross_amount)
                ),
                total_patient_payable: _.sumBy(dtl, (s) =>
                  parseFloat(s.patient_payable)
                ),
                total_patient_tax: _.sumBy(dtl, (s) =>
                  parseFloat(s.patient_tax)
                ),
                total_patient_resp: _.sumBy(dtl, (s) =>
                  parseFloat(s.patient_resp)
                ),
                total_company_resp: _.sumBy(dtl, (s) =>
                  parseFloat(s.company_resp)
                ),
                total_company_tax: _.sumBy(dtl, (s) =>
                  parseFloat(s.company_tax)
                ),
                total_company_payable: _.sumBy(dtl, (s) =>
                  parseFloat(s.company_payable)
                ),
              };
            })
            .value();

          const net_total = _.sumBy(result, (s) =>
            parseFloat(s.company_payable)
          );

          resolve({
            detail: result,
            ftr_total_gross_amount: _.sumBy(result, (s) =>
              parseFloat(s.total_gross_amount)
            ),
            ftr_total_patient_payable: _.sumBy(result, (s) =>
              parseFloat(s.total_patient_payable)
            ),
            ftr_total_patient_tax: _.sumBy(result, (s) =>
              parseFloat(s.total_patient_tax)
            ),
            ftr_total_patient_resp: _.sumBy(result, (s) =>
              parseFloat(s.total_patient_resp)
            ),
            ftr_total_company_resp: _.sumBy(result, (s) =>
              parseFloat(s.total_company_resp)
            ),
            ftr_total_company_tax: _.sumBy(result, (s) =>
              parseFloat(s.total_company_tax)
            ),
            ftr_total_company_payable: _.sumBy(result, (s) =>
              parseFloat(s.total_company_payable)
            ),
            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyOnly: {
              decimal_places,
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
