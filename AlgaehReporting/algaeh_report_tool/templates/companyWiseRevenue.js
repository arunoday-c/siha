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

      let show_vat = "";
      if (input.show_vat === "N") {
        show_vat = "sum(company_res) as show_vat, ";
      } else if (input.show_vat === "Y") {
        show_vat = "sum(company_payable) as show_vat, ";
      }

      let strData = "";

      // if (input.hims_d_insurance_sub_ids > 0) {
      if (input.hims_d_insurance_sub_ids.length > 0) {
        strData += ` and IM.primary_sub_id in (${input.hims_d_insurance_sub_ids})`;
      }

      console.log("input=", input);
      console.log("params=", params);

      options.mysql
        .executeQuery({
          query: `SELECT  ${show_vat}  IM.primary_sub_id,SI.insurance_sub_name,visit_id,bill_number,date(bill_date) as bill_date
          FROM hims_f_billing_header BH
          inner join hims_m_patient_insurance_mapping IM on IM.patient_visit_id = BH.visit_id
          inner join hims_d_insurance_sub SI on SI.hims_d_insurance_sub_id = IM.primary_sub_id
          where  date(BH.bill_date)  between date(?) and date(?) and BH.adjusted='N' and BH.cancelled='N' and BH.hospital_id=? ${strData}
          group by primary_sub_id,date(BH.bill_date)  order by IM.primary_sub_id;`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((results) => {
          const columns = _.chain(results)
            .groupBy((g) => g.bill_date)
            .map((details) => {
              const { bill_date } = _.head(details);
              return bill_date;
            })
            .value();

          let report = [];
          _.chain(results)
            .groupBy((g) => g.primary_sub_id)
            .forEach((details, key) => {
              debugger;
              const desc = _.head(details);
              let innerObject = {
                insurance_sub_name: desc.insurance_sub_name,
              };
              let items_inner_object = {};
              for (let i = 0; i < columns.length; i++) {
                const filteredData = details.find(
                  (f) => f.bill_date === columns[i]
                );

                items_inner_object[columns[i]] =
                  filteredData === undefined ? 0 : filteredData.show_vat;
              }
              //   _.sumBy(filteredData, (s) =>
              //     parseFloat(s["total_amount"] ? s["total_amount"] : 0)
              //   );
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
