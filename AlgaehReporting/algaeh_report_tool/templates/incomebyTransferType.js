// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const moment = options.moment;
      let input = {};
      let params = options.args.reportParams;
      let str = "";
      // const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let crypto_data = { ...options.args.crypto, addSymbol: false };
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      delete crypto_data.currency_symbol;
      crypto_data.currency_symbol = "";

      let strQuery = "";
      if (input.card_name > 0) {
        strQuery += `and  B.hims_d_bank_card_id=${input.card_name}`;
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_billing_header_id,
          RH.hims_f_receipt_header_id, RH.receipt_number, BH.bill_number,B.card_name,
          date(RH.receipt_date) as receipt_date, date(BH.bill_date) as bill_date, 
          RD.hims_f_receipt_details_id,RD.pay_type,sum (RD.amount) as totalAmt, RD.bank_card_id
          from  hims_f_billing_header BH
          inner join hims_f_receipt_header RH on BH.receipt_header_id=RH.hims_f_receipt_header_id
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id
          inner join hims_d_bank_card B on B.hims_d_bank_card_id = RD.bank_card_id
          where date(BH.bill_date)  between date(?) and date(?) and RD.pay_type='CD' and RD.amount <> 0 and
          BH.adjusted='N' and RH.record_status='A' and RD.record_status='A' and cancelled='N' and adjusted='N' and BH.hospital_id= ? ${strQuery}
          group by BH.hims_f_billing_header_id,date(BH.bill_date)  order by BH.hims_f_billing_header_id;`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((results) => {
          const columns = _.chain(results)
            .groupBy((g) => g.bank_card_id)
            .map((details) => {
              const { card_name } = _.head(details);
              return card_name;
            })
            .value();

          let report = [];
          _.chain(results)
            .groupBy((g) => g.bill_date)
            .forEach((details, key) => {
              const desc = _.head(details);
              let innerObject = {
                bill_date: desc.bill_date,
              };
              let items_inner_object = {};
              for (let i = 0; i < columns.length; i++) {
                const filteredData = details.filter(
                  (f) => f.card_name === columns[i]
                );
                const totalAmt = _.sumBy(filteredData, (s) =>
                  parseFloat(s.totalAmt)
                );

                items_inner_object[columns[i]] = totalAmt ? totalAmt : 0;
              }

              let total_item_count = 0;

              Object.keys(items_inner_object).forEach((itm) => {
                total_item_count =
                  total_item_count + parseFloat(items_inner_object[itm]);

                items_inner_object[itm] = options.currencyFormat(
                  items_inner_object[itm],
                  crypto_data
                );
              });

              total_item_count = options.currencyFormat(
                total_item_count,
                crypto_data
              );
              report.push({
                ...innerObject,
                ...items_inner_object,
                Total: total_item_count,
              });
            })
            .value();
          columns.push("Total");

          let footer = [];
          for (let i = 0; i < columns.length; i++) {
            footer.push(
              _.sumBy(report, (s) =>
                parseFloat(s[columns[i]].replace(/,/g, ""))
              )
            );
          }

          resolve({
            columns,
            footer,
            details: report,
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
            decimalOnly: {
              decimal_places,
              addSymbol: false,
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
