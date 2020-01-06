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
        strQry += ` and VD.payment_date between date('${input.from_date}') and date('${input.to_date}') `;
      }

      if (input.leafnode == "N") {
        options.mysql
          .executeQuery({
            query: `SELECT cost_center_type  FROM finance_options limit 1;`,
            values: [input.head_id],
            printQuery: true
          })
          .then(result => {
            if (result.length > 0) {
              //ST-cost center
              if (
                result[0]["cost_center_type"] == "P" &&
                input.cost_center_id > 0
              ) {
                strQry += ` and project_id=${input.cost_center_id} `;
              } else if (
                result[0]["cost_center_type"] == "SD" &&
                input.cost_center_id > 0
              ) {
                strQry += ` and sub_department_id=${input.cost_center_id} `;
              }
              //END-cost center
              options.mysql
                .executeQuery({
                  query: `  select finance_voucher_header_id,voucher_type,voucher_no,
                  VD.head_id,VD.payment_date ,VD.child_id,               
                  ROUND(sum(debit_amount),${decimal_places}) as debit_amount,
                   ROUND(sum(credit_amount),${decimal_places})  as credit_amount,C.child_name
                  from finance_voucher_header H inner join finance_voucher_details VD
                  on H.finance_voucher_header_id=VD.voucher_header_id inner join finance_account_child C on
                  VD.child_id=C.finance_account_child_id where  VD.auth_status='A' and
                  VD.head_id in (with recursive cte  as (          
                  select  finance_account_head_id  from finance_account_head H
                  inner join finance_account_child where finance_account_head_id =? union                  
                  select  H.finance_account_head_id from finance_account_head H
                  inner join cte on H.parent_acc_id = cte.finance_account_head_id    
                  )select * from cte ) ${strQry}   group by VD.payment_date,VD.child_id,voucher_no ;`,
                  values: [input.head_id],
                  printQuery: true
                })
                .then(final_result => {
                  let total_debit = parseFloat(0).toFixed(decimal_places);
                  let total_credit = parseFloat(0).toFixed(decimal_places);
                  if (final_result.length > 0) {
                    //to get only balace amount

                    // if (input.parent_id == 1 || input.parent_id == 5) {
                    //   //DR
                    // }
                    final_result.forEach(item => {
                      total_credit = (
                        parseFloat(total_credit) +
                        parseFloat(item.credit_amount)
                      ).toFixed(decimal_places);
                      total_debit = (
                        parseFloat(total_debit) + parseFloat(item.debit_amount)
                      ).toFixed(decimal_places);
                    });

                    resolve({
                      details: final_result,
                      total_debit: total_debit,
                      total_credit: total_credit
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

// with recursive cte  as (
//   select  finance_account_head_id  from finance_account_head H
//   inner join finance_account_child where finance_account_head_id =4
//   union
//   select  H.finance_account_head_id from finance_account_head H
//   inner join cte on H.parent_acc_id = cte.finance_account_head_id
//   )select * from cte
