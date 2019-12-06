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

      if (input.leafnode == "N") {
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
                       
            H.account_name,child_id,C.child_name
             FROM finance_voucher_details VD 
            inner join finance_account_head H on
            VD.head_id=H.finance_account_head_id inner join finance_account_child C on 
            VD.child_id=C.finance_account_child_id where 
            head_id in (?) and child_id in (?) ${strQry} group by payment_date,head_id,child_id with rollup;`,
                  values: [head_ids, child_ids],
                  printQuery: true
                })
                .then(final_result => {
                  if (final_result.length > 0) {
                    let outputArray = [];
                    let entriesArray = [];
                    let grand_total = {};
                    const records = [];
                    const datewiseTotals = [];
                    const datewiseHeadSum = [];

                    //seprating data
                    final_result.forEach(item => {
                      if (
                        item.head_id == null &&
                        item.child_id == null &&
                        item.payment_date == null
                      ) {
                        grand_total = item;
                      } else if (
                        item.payment_date != null &&
                        item.head_id == null &&
                        item.child_id == null
                      ) {
                        datewiseTotals.push(item);
                      } else if (
                        item.payment_date != null &&
                        item.head_id > 0 &&
                        item.child_id == null
                      ) {
                        datewiseHeadSum.push(item);
                      } else if (
                        item.payment_date != null &&
                        item.head_id > 0 &&
                        item.child_id > 0
                      ) {
                        records.push(item);
                      }
                    });

                    //-------------------------------------------------------------------------
                    //to get only balace amount
                    if (input.parent_id == 1 || input.parent_id == 5) {
                      entriesArray = records.map(m => {
                        return {
                          credit_amount: parseFloat(m.credit_amount).toFixed(
                            decimal_places
                          ),
                          debit_amount: parseFloat(m.debit_amount).toFixed(
                            decimal_places
                          ),
                          child_name: m.child_name,

                          head_id: m.head_id,
                          child_id: m.child_id,
                          payment_date: m.payment_date,
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
                          child_name: m.child_name,

                          head_id: m.head_id,
                          child_id: m.child_id,
                          payment_date: m.payment_date,
                          balance_amount: parseFloat(
                            m.credit_minus_debit
                          ).toFixed(decimal_places)
                        };
                      });
                    }

                    const dateWiseEntries = _.chain(entriesArray)
                      .groupBy(g => g.payment_date)
                      .value();

                    if (input.parent_id == 1 || input.parent_id == 5) {
                      datewiseTotals.forEach(data => {
                        const dateWiseheads = datewiseHeadSum.filter(
                          f => f.payment_date == data.payment_date
                        );
                        const dateWiseChilds =
                          dateWiseEntries[data.payment_date];

                        const details = [];

                        dateWiseheads.forEach(head => {
                          const entries = dateWiseChilds.filter(
                            child => head.head_id == child.head_id
                          );

                          details.push({
                            head_account: head.account_name,
                            total_of_head_account: head.debit_minus_credit,
                            entries: entries
                          });
                        });

                        outputArray.push({
                          payment_date: data.payment_date,
                          day_closing_bal: data.debit_minus_credit,
                          details: details
                        });
                      });
                    } else {
                      datewiseTotals.forEach(data => {
                        const dateWiseheads = datewiseHeadSum.filter(
                          f => f.payment_date == data.payment_date
                        );
                        const dateWiseChilds =
                          dateWiseEntries[data.payment_date];

                        const details = [];

                        dateWiseheads.forEach(head => {
                          const entries = dateWiseChilds.filter(
                            child => head.head_id == child.head_id
                          );

                          details.push({
                            head_account: head.account_name,
                            total_of_head_account: head.credit_minus_debit,
                            entries: entries
                          });
                        });

                        outputArray.push({
                          payment_date: data.payment_date,
                          day_closing_bal: data.credit_minus_debit,
                          details: details
                        });
                      });
                    }

                    let finalTotals = null;
                    if (input.parent_id == 1 || input.parent_id == 5) {
                      const symbol = " Dr";
                      finalTotals = {
                        final_credit_amount:
                          parseFloat(grand_total.credit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_debit_amount:
                          parseFloat(grand_total.debit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_balance:
                          parseFloat(grand_total.debit_minus_credit).toFixed(
                            decimal_places
                          ) + symbol
                      };
                    } else {
                      const symbol = " Cr";
                      finalTotals = {
                        final_credit_amount:
                          parseFloat(grand_total.credit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_debit_amount:
                          parseFloat(grand_total.debit_amount).toFixed(
                            decimal_places
                          ) + symbol,
                        final_balance:
                          parseFloat(grand_total.credit_minus_debit).toFixed(
                            decimal_places
                          ) + symbol
                      };
                    }

                    resolve({ data: outputArray, ...finalTotals });
                  } else {
                    resolve({
                      details: []
                    });
                  }
                })
                .catch(e => {
                  options.mysql.releaseConnection();
                  next(e);
                });
            } else {
              resolve({
                details: []
              });
            }
          })
          .catch(e => {
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
