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

      if (input.leafnode == "Y") {
        options.mysql
          .executeQuery({
            query: `SELECT cost_center_type  FROM finance_options limit 1;`,
            values: [
              input.head_id,
              input.child_id,
              input.head_id,
              input.child_id
            ],
            printQuery: true
          })
          .then(resul => {
            //ST-cost center
            if (
              resul[0]["cost_center_type"] == "P" &&
              input.cost_center_id > 0
            ) {
              strQry += ` and project_id=${input.cost_center_id} `;
            } else if (
              resul[0]["cost_center_type"] == "SD" &&
              input.cost_center_id > 0
            ) {
              strQry += ` and sub_department_id=${input.cost_center_id} `;
            }
            //END-cost center

            options.mysql
              .executeQuery({
                query: `SELECT finance_voucher_id,payment_date ,credit_amount, debit_amount,
                      coalesce(debit_amount-credit_amount,0)as debit_minus_credit ,
                      coalesce(credit_amount-debit_amount,0)as credit_minus_debit ,
                      narration,concat(H.account_name,' -> ',C.child_name) as account_details FROM 
                      finance_voucher_details VD inner join finance_account_head H on
                      VD.head_id=H.finance_account_head_id inner join finance_account_child C on 
                      VD.child_id=C.finance_account_child_id where 
                      head_id=? and child_id=? ${strQry};
                      SELECT finance_voucher_id,payment_date ,sum(credit_amount) as total_credit_amount,
                      sum(debit_amount) as total_debit_amount ,
                      coalesce(sum(debit_amount)-sum(credit_amount),0)as debit_minus_credit ,
                      coalesce(sum(credit_amount)-sum(debit_amount),0)as credit_minus_debit FROM 
                      finance_voucher_details  where 
                      head_id=? and child_id=? ${strQry} group by payment_date with rollup  ;`,
                values: [
                  input.head_id,
                  input.child_id,
                  input.head_id,
                  input.child_id
                ],
                printQuery: true
              })
              .then(result => {
                options.mysql.releaseConnection();

                if (result[0].length > 0) {
                  const entries = result[0];
                  const dateWiseSum = result[1];

                  const totals = dateWiseSum.pop();

                  let outputArray = [];
                  let entriesArray = [];
                  //ST-all entries
                  if (input.parent_id == 1 || input.parent_id == 5) {
                    entriesArray = entries.map(m => {
                      return {
                        credit_amount: parseFloat(m.credit_amount).toFixed(
                          decimal_places
                        ),
                        debit_amount: parseFloat(m.debit_amount).toFixed(
                          decimal_places
                        ),
                        account_details: m.account_details,
                        narration: m.narration,
                        payment_date: m.payment_date,
                        balance_amount: parseFloat(
                          m.debit_minus_credit
                        ).toFixed(decimal_places)
                      };
                    });
                  } else {
                    entriesArray = entries.map(m => {
                      return {
                        credit_amount: parseFloat(m.credit_amount).toFixed(
                          decimal_places
                        ),
                        debit_amount: parseFloat(m.debit_amount).toFixed(
                          decimal_places
                        ),
                        account_details: m.account_details,
                        narration: m.narration,
                        payment_date: m.payment_date,
                        balance_amount: parseFloat(
                          m.credit_minus_debit
                        ).toFixed(decimal_places)
                      };
                    });
                  }
                  //END-all entries
                  //ST-Grouping datewise  entries
                  const entriesGroup = _.chain(entriesArray)
                    .groupBy(g => g.payment_date)
                    .value();
                  //END-Grouping datewise  entries
                  let finalTotals = null;
                  if (input.parent_id == 1 || input.parent_id == 5) {
                    const symbol = " Dr";

                    //ST-GRAND TOTAL
                    finalTotals = {
                      final_credit_amount:
                        parseFloat(totals.total_credit_amount).toFixed(
                          decimal_places
                        ) + symbol,
                      final_debit_amount:
                        parseFloat(totals.total_debit_amount).toFixed(
                          decimal_places
                        ) + symbol,
                      final_balance:
                        parseFloat(totals.debit_minus_credit).toFixed(
                          decimal_places
                        ) + symbol
                    };
                    //END-GRAND TOTAL
                    //ST-datewise  entries and thier totals
                    dateWiseSum.forEach(item => {
                      outputArray.push({
                        entries: entriesGroup[item.payment_date],
                        total_debit_amount:
                          parseFloat(item.total_debit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        total_credit_amount:
                          parseFloat(item.total_credit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        balance:
                          parseFloat(item.debit_minus_credit).toFixed(
                            decimal_places
                          ) + symbol,
                        date: item.payment_date
                      });
                    });
                    //END-datewise  entries and thier totals
                  } else {
                    const symbol = " Cr";
                    //ST-GRAND TOTAL
                    finalTotals = {
                      final_credit_amount:
                        parseFloat(totals.total_credit_amount).toFixed(
                          decimal_places
                        ) + symbol,
                      final_debit_amount:
                        parseFloat(totals.total_debit_amount).toFixed(
                          decimal_places
                        ) + symbol,
                      final_balance:
                        parseFloat(totals.credit_minus_debit).toFixed(
                          decimal_places
                        ) + symbol
                    };
                    //END-GRAND TOTAL
                    //ST-datewise  entries and thier totals
                    dateWiseSum.forEach(item => {
                      outputArray.push({
                        entries: entriesGroup[item.payment_date],
                        total_debit_amount:
                          parseFloat(item.total_debit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        total_credit_amount:
                          parseFloat(item.total_credit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        balance:
                          parseFloat(item.credit_minus_debit).toFixed(
                            decimal_places
                          ) + symbol,
                        date: item.payment_date
                      });
                    });
                    //END-datewise  entries and thier totals
                  }

                  resolve({
                    details: outputArray,
                    ...finalTotals
                  });
                } else {
                  resolve({
                    details: []
                  });
                }
              })
              .catch(e => {
                console.log("EEEE:", e);
                options.mysql.releaseConnection();
                next(e);
              });
          })
          .catch(e => {
            console.log("EEEE6:", e);
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
