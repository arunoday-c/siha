// const { MONTHS } = require("./GlobalVariables.json");
// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      const moment = options.moment;
      let input = {};
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      const params = options.args.reportParams;

      // const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // const { limit_from, limit_to } = options.args.recordSetup;
      let limit_from = undefined;
      let limit_to = undefined;
      if (options.args.recordSetup) {
        limit_from = options.args.recordSetup
          ? options.args.recordSetup.limit_from
          : undefined;
        limit_to = options.args.recordSetup
          ? options.args.recordSetup.limit_to
          : undefined;
      }
      let lastOpeningBalance = 0;
      if (options.args.recordSetup && options.args.recordSetup.others) {
        const others = options.args.recordSetup.others;
        lastOpeningBalance = parseFloat(others["6"].replace(/,/g, ""));
      }
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
            // values: [input.head_id],
            printQuery: true,
          })
          .then((result) => {
            if (result.length > 0) {
              let totalQuery = "";
              let limitDefine = "";
              if (limit_from !== undefined && limit_from === 0) {
                totalQuery = "SELECT FOUND_ROWS() total_pages;";
              }
              if (limit_from !== undefined && limit_to !== undefined) {
                limitDefine = ` limit ${limit_to} offset ${limit_from}`;
              }
              console.log(
                "limit_from && limit_from === 0",
                limit_from !== undefined && limit_to !== undefined
              );
              options.mysql
                .executeQuery({
                  query: `select ${
                    totalQuery !== "" ? "SQL_CALC_FOUND_ROWS" : ""
                  } H.finance_voucher_header_id, 
                  case when H.voucher_type='journal' then 'Journal' when H.voucher_type='contra' then 'Contra'
                  when H.voucher_type='receipt' then 'Receipt' when H.voucher_type='payment' then 'Payment'
                  when H.voucher_type='sales' then 'Sales' when H.voucher_type='purchase' then 'Purchase'
                  when H.voucher_type='credit_note' then 'Credit Note' when H.voucher_type='debit_note' then 'Debit Note'
                  when H.voucher_type='expense_voucher' then 'Expense' when H.voucher_type='year_end' then 'Year End'
                  when H.voucher_type='year_end_rev' then 'Year End Reversal' end as voucher_type, H.voucher_no,
                  VD.head_id,VD.payment_date,VD.child_id,               
                  ROUND(sum(debit_amount),${decimal_places}) as debit_amount,
                   ROUND(sum(credit_amount),${decimal_places}) as credit_amount,C.child_name
                  from finance_voucher_header H 
                  inner join finance_voucher_details VD on H.finance_voucher_header_id=VD.voucher_header_id 
                  inner join finance_account_child C on VD.child_id=C.finance_account_child_id 
                  where  VD.auth_status='A' and VD.head_id in (with recursive cte as (     
                  select  finance_account_head_id  from finance_account_head H
                  inner join finance_account_child where finance_account_head_id =? union                  
                  select  H.finance_account_head_id from finance_account_head H
                  inner join cte on H.parent_acc_id = cte.finance_account_head_id    
                  ) select * from cte ) ${strQry}   group by VD.payment_date,VD.child_id,voucher_no  order by VD.payment_date and H.voucher_no ${limitDefine} ;
                  ${totalQuery}
                  `,
                  values: [input.head_id],
                  printQuery: true,
                })
                .then((resultX) => {
                  const final_result = totalQuery !== "" ? resultX[0] : resultX;
                  let total_debit = parseFloat(0).toFixed(decimal_places);
                  let total_credit = parseFloat(0).toFixed(decimal_places);
                  //if (final_result.length > 0) {
                  //to get only balace amount

                  // if (input.parent_id == 1 || input.parent_id == 5) {
                  //   //DR
                  // }
                  console.log("final_result===>", final_result);

                  final_result.forEach((item) => {
                    total_credit = (
                      parseFloat(total_credit) + parseFloat(item.credit_amount)
                    ).toFixed(decimal_places);
                    total_debit = (
                      parseFloat(total_debit) + parseFloat(item.debit_amount)
                    ).toFixed(decimal_places);
                  });

                  // const dateWiseGroup = _.chain(final_result)
                  //   .groupBy((g) => g.payment_date)
                  //   .value();

                  // const outputArray = [];

                  // for (let i in dateWiseGroup) {
                  //   dateWiseGroup[i][0]["transaction_date"] = i;
                  //   outputArray.push(...dateWiseGroup[i]);
                  // }
                  const outputArray = final_result;
                  const totalRecords =
                    totalQuery !== ""
                      ? resultX[1][0]["total_pages"]
                      : undefined;
                  resolve({
                    details: outputArray,
                    total_debit: total_debit,
                    total_credit: total_credit,
                    totalRecords,
                    from_date: moment(input.from_date, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    ),
                    to_date: moment(input.to_date, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    ),
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
                  // } else {
                  //   resolve({
                  //     details: [],
                  //   });
                  // }
                })
                .catch((e) => {
                  options.mysql.releaseConnection();
                  reject(e);
                });
            } else {
              resolve({
                details: [],
              });
            }
          })
          .catch((e) => {
            options.mysql.releaseConnection();
            reject(e);
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

// with recursive cte  as (
//   select  finance_account_head_id  from finance_account_head H
//   inner join finance_account_child where finance_account_head_id =4
//   union
//   select  H.finance_account_head_id from finance_account_head H
//   inner join cte on H.parent_acc_id = cte.finance_account_head_id
//   )select * from cte
