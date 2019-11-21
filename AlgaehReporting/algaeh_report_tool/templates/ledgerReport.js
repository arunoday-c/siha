// const { MONTHS } = require("./GlobalVariables.json");
// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      console.log("am here baba :");

      const _ = options.loadash;

      const moment = options.moment;
      let input = {};

      const params = options.args.reportParams;
      const default_nationality = options.args.crypto.default_nationality;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      console.log("input:", input);

      let strQry = "";

      if (
        moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
        moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
      ) {
        strQry = ` and payment_date between date('${input.from_date}') and date('${input.to_date}') `;
      }

      let group_str = " group by payment_date ";

      if (input.monthwise == "Y") {
        group_str = " group by month ";
      }

      if (input.leafnode == "Y") {
        console.log("leaf:");

        options.mysql
          .executeQuery({
            query: `SELECT finance_voucher_id,payment_date ,credit_amount, debit_amount,
            coalesce(debit_amount-credit_amount,0)as debit_minus_credit ,
            coalesce(credit_amount-debit_amount,0)as credit_minus_debit ,
            case payment_type when 'CR' then 'Credit' else 'Debit' end as payment_type,
            narration,concat(H.account_name,' -> ',C.child_name) as account_details FROM 
            finance_voucher_details VD inner join finance_account_head H on
             VD.head_id=H.finance_account_head_id inner join finance_account_child C on 
             VD.child_id=C.finance_account_child_id where 
            head_id=? and child_id=? ${strQry} ;`,
            values: [input.head_id, input.child_id],
            printQuery: true
          })
          .then(result => {
            console.log("result:", result);

            let outputArray = [];
            if (input.parent_id == 1 || input.parent_id == 5) {
              outputArray = result.map(m => {
                return {
                  ...m,
                  balance_amount: m.debit_minus_credit
                };
              });
            } else {
              outputArray = result.map(m => {
                return {
                  ...m,
                  balance_amount: m.credit_minus_debit
                };
              });
            }
            console.log("outputArray:", outputArray);
            resolve({ details: outputArray });
          })
          .catch(e => {
            options.mysql.releaseConnection();
            reject(e);
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
            printQuery: true
          })
          .then(result => {
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
                narration,concat(H.account_name,' -> ',C.child_name) as account_details
                 FROM finance_voucher_details VD 
                inner join finance_account_head H on
                VD.head_id=H.finance_account_head_id inner join finance_account_child C on 
                VD.child_id=C.finance_account_child_id where 
                head_id in (?) and child_id in (?) ${strQry} group by head_id,child_id with rollup`,
                values: [head_ids, child_ids],
                printQuery: true
              })
              .then(final_result => {
                let outputArray = [];

                const records = [];
                const totals = [];

                let total_amount = 0;
                final_result.forEach(item => {
                  if (item.head_id == null && item.child_id == null) {
                    totals.push(item);
                  } else if (item.head_id > 0 && item.child_id > 0) {
                    records.push(item);
                  }
                });

                if (input.parent_id == 1 || input.parent_id == 5) {
                  total_amount = totals[0]["debit_minus_credit"];
                  outputArray = records.map(m => {
                    return {
                      ...m,
                      balance_amount: m.debit_minus_credit
                    };
                  });
                } else {
                  total_amount = totals[0]["credit_minus_debit"];
                  outputArray = records.map(m => {
                    return {
                      ...m,
                      balance_amount: m.credit_minus_debit
                    };
                  });
                }
                console.log("totals:", totals);
                resolve({ details: outputArray, total_amount: total_amount });
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
