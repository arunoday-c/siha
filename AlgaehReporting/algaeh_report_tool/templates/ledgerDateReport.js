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
        console.log("leaf:");

        options.mysql
          .executeQuery({
            query: `SELECT finance_voucher_id,payment_date ,credit_amount, debit_amount,
                      coalesce(debit_amount-credit_amount,0)as debit_minus_credit ,
                      coalesce(credit_amount-debit_amount,0)as credit_minus_debit ,
                      narration,concat(H.account_name,' -> ',C.child_name) as account_details FROM 
                      finance_voucher_details VD inner join finance_account_head H on
                      VD.head_id=H.finance_account_head_id inner join finance_account_child C on 
                      VD.child_id=C.finance_account_child_id where 
                      head_id=? and child_id=? ;
                      SELECT finance_voucher_id,payment_date ,sum(credit_amount) as total_credit_amount,
                      sum(debit_amount) as total_debit_amount ,
                      coalesce(sum(debit_amount)-sum(credit_amount),0)as debit_minus_credit ,
                      coalesce(sum(credit_amount)-sum(debit_amount),0)as credit_minus_debit FROM 
                      finance_voucher_details  where 
                      head_id=? and child_id=? group by payment_date with rollup  ;`,
            values: [
              input.head_id,
              input.child_id,
              input.head_id,
              input.child_id
            ],
            printQuery: false
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
                    balance_amount: parseFloat(m.debit_minus_credit).toFixed(
                      decimal_places
                    )
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
                    balance_amount: parseFloat(m.credit_minus_debit).toFixed(
                      decimal_places
                    )
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
                ...finalTotals,
                date_or_account: "Date"
              });
            } else {
              resolve({
                details: [],
                date_or_account: "Date"
              });
            }
          })
          .catch(e => {
            console.log("EEEE:", e);
            options.mysql.releaseConnection();
            next(e);
          });
      } else {
        console.log("NON LEAF:");
        options.mysql
          .executeQuery({
            query: ` with recursive cte  as (          
          select  finance_account_head_id,PC.child_id
          from finance_account_head P left join finance_head_m_child PC on P.finance_account_head_id
          =PC.head_id where finance_account_head_id=?
          union                  
          select H.finance_account_head_id,PC.child_id
          from finance_account_head  H inner join cte
          on H.parent_acc_id = cte.finance_account_head_id   left join finance_head_m_child PC on H.finance_account_head_id
          =PC.head_id )select * from cte;`,
            values: [input.head_id],
            printQuery: false
          })
          .then(result => {
            if (result.length > 0) {
              const head_ids = result.map(m => m.finance_account_head_id);
              const child_ids = result
                .filter(f => {
                  return f.child_id > 0;
                })
                .map(m => m.child_id);

              options.mysql
                .executeQuery({
                  query: `   SELECT finance_voucher_id,payment_date ,head_id,child_id,
              sum(credit_amount) as credit_amount,sum(debit_amount) as debit_amount,
              coalesce( sum(credit_amount)-sum(debit_amount),0)as credit_minus_debit,               
              coalesce(sum(debit_amount)- sum(credit_amount),0)as debit_minus_credit,               
              case payment_type when 'CR' then 'Credit' else 'Debit' end as payment_type,
              narration,concat(H.account_name,' -> ',C.child_name) as account_details,
              H.account_name,child_id,C.child_name
               FROM finance_voucher_details VD 
              inner join finance_account_head H on
              VD.head_id=H.finance_account_head_id inner join finance_account_child C on 
              VD.child_id=C.finance_account_child_id where 
              head_id in (?) and child_id in (?)  group by head_id,child_id with rollup`,
                  values: [head_ids, child_ids],
                  printQuery: false
                })
                .then(final_result => {
                  if (final_result.length > 0) {
                    let outputArray = [];
                    let entriesArray = [];

                    const records = [];
                    let totals = {};
                    const heads = [];

                    final_result.forEach(item => {
                      if (item.head_id == null && item.child_id == null) {
                        totals = item;
                      } else if (item.head_id > 0 && item.child_id == null) {
                        heads.push(item);
                      } else if (item.head_id > 0 && item.child_id > 0) {
                        records.push(item);
                      }
                    });

                    if (input.parent_id == 1 || input.parent_id == 5) {
                      entriesArray = records.map(m => {
                        return {
                          credit_amount: parseFloat(m.credit_amount).toFixed(
                            decimal_places
                          ),
                          debit_amount: parseFloat(m.debit_amount).toFixed(
                            decimal_places
                          ),
                          account_details: m.account_details,
                          narration: m.narration,
                          head_id: m.head_id,

                          balance_amount: parseFloat(
                            m.debit_minus_credit
                          ).toFixed(decimal_places)
                        };
                      });
                    } else {
                      entriesArray = records.map(m => {
                        return {
                          credit_amount: parseFloat(m.credit_amount).toFixed(
                            decimal_places
                          ),
                          debit_amount: parseFloat(m.debit_amount).toFixed(
                            decimal_places
                          ),
                          account_details: m.account_details,
                          narration: m.narration,
                          head_id: m.head_id,
                          balance_amount: parseFloat(
                            m.credit_minus_debit
                          ).toFixed(decimal_places)
                        };
                      });
                    }

                    const entriesGroup = _.chain(entriesArray)
                      .groupBy(g => g.head_id)
                      .value();

                    let finalTotals = null;
                    if (input.parent_id == 1 || input.parent_id == 5) {
                      const symbol = " Dr";
                      finalTotals = {
                        final_credit_amount:
                          parseFloat(totals.credit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_debit_amount:
                          parseFloat(totals.debit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_balance:
                          parseFloat(totals.debit_minus_credit).toFixed(
                            decimal_places
                          ) + symbol
                      };
                      heads.forEach(item => {
                        outputArray.push({
                          entries: entriesGroup[item.head_id],
                          total_debit_amount:
                            parseFloat(item.debit_amount).toFixed(
                              decimal_places
                            ) + symbol,
                          total_credit_amount:
                            parseFloat(item.credit_amount).toFixed(
                              decimal_places
                            ) + symbol,
                          balance:
                            parseFloat(item.debit_minus_credit).toFixed(
                              decimal_places
                            ) + symbol,
                          date: item.account_name
                        });
                      });
                    } else {
                      const symbol = " Cr";
                      finalTotals = {
                        final_credit_amount:
                          parseFloat(totals.credit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_debit_amount:
                          parseFloat(totals.debit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_balance:
                          parseFloat(totals.credit_minus_debit).toFixed(
                            decimal_places
                          ) + symbol
                      };
                      heads.forEach(item => {
                        outputArray.push({
                          entries: entriesGroup[item.head_id],
                          total_debit_amount:
                            parseFloat(item.debit_amount).toFixed(
                              decimal_places
                            ) + symbol,
                          total_credit_amount:
                            parseFloat(item.credit_amount).toFixed(
                              decimal_places
                            ) + symbol,
                          balance:
                            parseFloat(item.credit_minus_debit).toFixed(
                              decimal_places
                            ) + symbol,
                          date: item.account_name
                        });
                      });
                    }

                    resolve({
                      details: outputArray,
                      ...finalTotals,
                      date_or_account: "Account Head"
                    });
                  } else {
                    resolve({
                      details: [],
                      date_or_account: "Account Head"
                    });
                  }
                })
                .catch(e => {
                  options.mysql.releaseConnection();
                  next(e);
                });
            } else {
              resolve({
                details: [],
                date_or_account: "Account Head"
              });
            }
          })
          .catch(e => {
            options.mysql.releaseConnection();
            next(e);
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
