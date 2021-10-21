// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      // let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select date(BH.bill_date)as bill_date, 
          sum(BH.patient_res) as patient_before_tax,sum(BH.patient_tax) as patient_tax, sum(BH.patient_res + BH.patient_tax) as patient_after_tax,
          sum(BH.company_res) as company_before_tax,sum(BH.company_tax) as company_tax, sum(BH.company_res + BH.company_tax) as company_after_tax
          from hims_f_billing_header BH 
          where date(BH.bill_date)  between date(?) and date(?) and BH.adjusted='N' and BH.cancelled='N' and BH.hospital_id= ?
          group by date(BH.bill_date);
          `,
          values: [
            input.from_date,
            input.to_date,
            // input.pay_type,
            input.hospital_id,
          ],
          printQuery: true,
        })
        .then((results) => {
          const result = {
            details: results,
            show_vat: input.show_vat,
            total_patient_before_tax: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.patient_before_tax)),
              options.args.crypto
            ),
            total_patient_tax: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.patient_tax)),
              options.args.crypto
            ),
            total_patient_after_tax: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.patient_after_tax)),
              options.args.crypto
            ),
            total_company_before_tax: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.company_before_tax)),
              options.args.crypto
            ),
            total_company_tax: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.company_tax)),
              options.args.crypto
            ),
            total_company_after_tax: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.company_after_tax)),
              options.args.crypto
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
