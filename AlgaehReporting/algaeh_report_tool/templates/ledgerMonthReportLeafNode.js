// const { MONTHS } = require("./GlobalVariables.json");
// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      const moment = options.moment;
      let input = {};

      const params = options.args.reportParams;

      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let strQry = "";

      if (
        moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
        moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
      ) {
        strQry = ` and payment_date between date('${input.from_date}') and date('${input.to_date}') `;
      }

      if (input.monthwise == "Y") {
        group_str = " group by month ";
      }

      if (input.leafnode == "Y") {
        options.mysql
          .executeQuery({
            query: ` SELECT finance_voucher_id,monthname(concat('1999-',month,'-01')) as month_name ,
          sum(credit_amount) as credit_amount,
          sum(debit_amount) as debit_amount ,head_id,child_id,month,
          coalesce(sum(debit_amount)-sum(credit_amount),0)as debit_minus_credit ,
          coalesce(sum(credit_amount)-sum(debit_amount),0)as credit_minus_debit ,
          concat(H.account_name,'->',C.child_name) as account_details FROM
          finance_voucher_details VD left join finance_account_head H on VD.head_id=H.finance_account_head_id
          left join finance_account_child C on VD.child_id=C.finance_account_child_id where
          head_id=? and child_id=?  group by month with rollup  ;`,
            values: [input.head_id, input.child_id],
            printQuery: true
          })
          .then(result => {
            if (result.length > 0) {
              const totals = result.pop();

              let outputArray = [];
              //ST-all months
              if (input.parent_id == 1 || input.parent_id == 5) {
                outputArray = result.map(m => {
                  return {
                    month_name: m.month_name,
                    credit_amount: parseFloat(m.credit_amount).toFixed(
                      decimal_places
                    ),
                    debit_amount: parseFloat(m.debit_amount).toFixed(
                      decimal_places
                    ),
                    account_details: m.account_details,

                    balance_amount: parseFloat(m.debit_minus_credit).toFixed(
                      decimal_places
                    )
                  };
                });
              } else {
                outputArray = result.map(m => {
                  return {
                    month_name: m.month_name,
                    credit_amount: parseFloat(m.credit_amount).toFixed(
                      decimal_places
                    ),
                    debit_amount: parseFloat(m.debit_amount).toFixed(
                      decimal_places
                    ),
                    account_details: m.account_details,

                    balance_amount: parseFloat(m.credit_minus_debit).toFixed(
                      decimal_places
                    )
                  };
                });
              }
              //END-all months

              let final_totals = {};
              if (input.parent_id == 1 || input.parent_id == 5) {
                const symbol = " Dr";
                final_totals = {
                  final_bal:
                    parseFloat(totals.debit_minus_credit).toFixed(
                      decimal_places
                    ) + symbol,
                  total_credit:
                    parseFloat(totals.credit_amount).toFixed(decimal_places) +
                    symbol,
                  total_debit:
                    parseFloat(totals.debit_amount).toFixed(decimal_places) +
                    symbol
                };
              } else {
                const symbol = " Cr";
                final_totals = {
                  final_bal:
                    parseFloat(totals.credit_minus_debit).toFixed(
                      decimal_places
                    ) + symbol,
                  total_credit:
                    parseFloat(totals.credit_amount).toFixed(decimal_places) +
                    symbol,
                  total_debit:
                    parseFloat(totals.debit_amount).toFixed(decimal_places) +
                    symbol
                };
              }

              resolve({
                ...final_totals,
                details: outputArray
              });
            } else {
              resolve({
                details: []
              });
            }
          })
          .catch(e => {
            console.log("EROOR:", e);
            options.mysql.releaseConnection();
            next(e);
          });
      } else {
        resolve({
          details: []
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
