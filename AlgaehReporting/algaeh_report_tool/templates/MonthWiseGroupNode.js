const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      const moment = options.moment;
      let input = {};

      const params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
      // const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
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
            printQuery: true,
          })
          .then((result) => {
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
                  query: `select finance_voucher_id,VD.head_id ,VD.child_id,monthname(concat('1999-',month,'-01')) as month_name, 
                  ROUND(sum(debit_amount),${decimal_places}) as debit_amount,ROUND(sum(credit_amount),${decimal_places})  as credit_amount,C.child_name
                  from finance_voucher_details VD inner join finance_account_child C on
                  VD.child_id=C.finance_account_child_id where  VD.auth_status='A' and
                  VD.head_id in (with recursive cte  as (
                  select  finance_account_head_id  from finance_account_head H
                  inner join finance_account_child where finance_account_head_id =7 union
                  select  H.finance_account_head_id from finance_account_head H
                  inner join cte on H.parent_acc_id = cte.finance_account_head_id
                  )select * from cte ) ${strQry}   group by month,child_id ;`,

                  values: [input.head_id],
                  printQuery: true,
                })
                .then((final_result) => {
                  let total_debit = parseFloat(0).toFixed(decimal_places);
                  let total_credit = parseFloat(0).toFixed(decimal_places);
                  if (final_result.length > 0) {
                    //to get only balace amount

                    // if (input.parent_id == 1 || input.parent_id == 5) {
                    //   //DR
                    // }
                    final_result.forEach((item) => {
                      total_credit = (
                        parseFloat(total_credit) +
                        parseFloat(item.credit_amount)
                      ).toFixed(decimal_places);
                      total_debit = (
                        parseFloat(total_debit) + parseFloat(item.debit_amount)
                      ).toFixed(decimal_places);
                    });

                    const monthWiseGroup = _.chain(final_result)
                      .groupBy((g) => g.month_name)
                      .value();

                    const outputArray = [];

                    for (let i in monthWiseGroup) {
                      monthWiseGroup[i][0]["transaction_month"] = i;
                      outputArray.push(...monthWiseGroup[i]);
                    }

                    resolve({
                      details: outputArray,
                      total_debit: total_debit,
                      total_credit: total_credit,
                      decimalOnly: {
                        decimal_places,
                        addSymbol: false,
                        symbol_position,
                        currency_symbol,
                      },
                      currencyOnly: {
                        decimal_places,
                        addSymbol: false,
                        symbol_position,
                        currency_symbol,
                      },
                    });
                  } else {
                    resolve({
                      details: [],
                    });
                  }
                })
                .catch((e) => {
                  console.log("IRFAN :", e);
                  options.mysql.releaseConnection();
                  next(e);
                });
            } else {
              resolve({
                details: [],
              });
            }
          })
          .catch((e) => {
            console.log("IRFAN :", e);
            options.mysql.releaseConnection();
            next(e);
          });
      } else {
        resolve({
          details: [],
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
