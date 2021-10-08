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
            select hims_f_receipt_header_id,receipt_date,
            sum(cash) as cash, sum(card) as card, sum(amount) as total,
            sum(patient_res) as patient_before_tax, sum(patient_tax) as patient_tax, sum(patient_payable) as patient_after_tax,
            sum(company_res) as company_before_tax, sum(company_tax) as company_tax, sum(company_payable) as company_after_tax
            from (
            select RH.hims_f_receipt_header_id,
            date(RH.receipt_date) as receipt_date ,RD.pay_type,RD.amount,
            case RD.pay_type when 'CA' then RD.amount else '0.00' end as cash,
            case RD.pay_type when 'CD' then RD.amount else '0.00' end as card,
            BH.patient_res,BH.patient_tax, BH.patient_payable,
            BH.company_res,BH.company_tax, BH.company_payable
            from  hims_f_billing_header BH
            inner join hims_f_receipt_header RH on BH.receipt_header_id=RH.hims_f_receipt_header_id
            inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id
            where date(BH.bill_date)  between date(?) and date(?) and
            BH.adjusted='N' and RH.record_status='A' and RD.record_status='A' and cancelled='N' and adjusted='N' and BH.hospital_id= '1')
            as A group by receipt_date;
          `,
          values: [
            input.from_date,
            input.to_date,
            // input.pay_type,
            // input.hospital_id,
          ],
          printQuery: true,
        })
        .then((results) => {
          const result = {
            details: results,
            show_vat: input.show_vat,
            expected_cash: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.cash)),
              options.args.crypto
            ),
            expected_card: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.card)),
              options.args.crypto
            ),
            expected_total: options.currencyFormat(
              _.sumBy(results, (s) => parseFloat(s.total)),
              options.args.crypto
            ),
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
