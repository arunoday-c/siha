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
      const limit_from = options.args?.recordSetup?.limit_from;
      const limit_to = options.args?.recordSetup?.limit_to;
      // const { limit_from, limit_to } = options.args?.recordSetup;
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
            values: [],
            printQuery: true,
          })
          .then((resul) => {
            // select finance_voucher_header_id,
            //     case when H.voucher_type='journal' then 'Journal' when H.voucher_type='contra' then 'Contra'
            //     when H.voucher_type='receipt' then 'Receipt' when H.voucher_type='payment' then 'Payment'
            //     when H.voucher_type='sales' then 'Sales' when H.voucher_type='purchase' then 'Purchase'
            //     when H.voucher_type='credit_note' then 'Credit Note' when H.voucher_type='debit_note' then 'Debit Note'
            //     when H.voucher_type='expense_voucher' then 'Expense' when H.voucher_type='year_end' then 'Year End'
            //     when H.voucher_type='year_end_rev' then 'Year End Reversal' end as voucher_type,
            //     voucher_no,VD.narration,
            //     VD.head_id,VD.payment_date, VD.child_id, AH.root_id,
            //     debit_amount,credit_amount,C.child_name,C.ledger_code
            //     from finance_voucher_header H right join finance_voucher_details VD
            //     on H.finance_voucher_header_id=VD.voucher_header_id inner join finance_account_child C on
            //     VD.child_id=C.finance_account_child_id inner join  finance_account_head AH on
            //     C.head_id=AH.finance_account_head_id where VD.auth_status='A' and
            //     VD.child_id=? ${strQry} order by VD.payment_date

            let totalQuery = "";
            let limitDefine = "";

            // console.log("limit_from && limit_to", limit_from && limit_to);
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
                query: `
                select ${
                  totalQuery !== "" ? "SQL_CALC_FOUND_ROWS" : ""
                } * from view_date_wise_leaf_node where child_id=? ${strQry} order by payment_date ${limitDefine} ;
                ${totalQuery}
                select  child_id,ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),2) as cred_minus_deb,
                ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),2)  as deb_minus_cred
                from   finance_voucher_details    where child_id=? and auth_status='A'  and payment_date < ?;
                select  child_id,ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),2) as cred_minus_deb,
                ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),2)  as deb_minus_cred
                from   finance_voucher_details    where child_id=? and auth_status='A'  and payment_date <= ?;  
               
                `,
                values: [
                  input.child_id,
                  input.child_id,
                  input.from_date,
                  input.child_id,
                  input.to_date,
                ],
                printQuery: true,
              })
              .then((output) => {
                let result = output[0];
                let opening_balance = parseFloat(0).toFixed(decimal_places);
                let closing_balance = parseFloat(0).toFixed(decimal_places);
                options.mysql.releaseConnection();
                let total_debit = parseFloat(0).toFixed(decimal_places);
                let total_credit = parseFloat(0).toFixed(decimal_places);
                if (result.length > 0) {
                  let CB_debit_side = null;
                  let CB_credit_side = null;
                  result.forEach((item) => {
                    total_credit = (
                      parseFloat(total_credit) + parseFloat(item.credit_amount)
                    ).toFixed(decimal_places);
                    total_debit = (
                      parseFloat(total_debit) + parseFloat(item.debit_amount)
                    ).toFixed(decimal_places);
                  });
                  const outputArray = [];

                  let final_balance = "";

                  if (result[0]["root_id"] == 1 || result[0]["root_id"] == 5) {
                    const diffrence = parseFloat(
                      total_debit - total_credit
                    ).toFixed(decimal_places);
                    if (diffrence > 0) {
                      CB_credit_side = diffrence;
                    } else {
                      CB_debit_side = diffrence;
                    }

                    final_balance = total_debit;

                    opening_balance =
                      output[totalQuery !== "" ? 2 : 1][0]["deb_minus_cred"];
                    closing_balance =
                      output[totalQuery !== "" ? 3 : 2][0]["deb_minus_cred"];
                  } else {
                    const diffrence = parseFloat(
                      total_credit - total_debit
                    ).toFixed(decimal_places);
                    if (diffrence > 0) {
                      CB_debit_side = diffrence;
                    } else {
                      CB_credit_side = diffrence;
                    }
                    final_balance = total_credit;

                    opening_balance =
                      output[totalQuery !== "" ? 2 : 1][0]["cred_minus_deb"];
                    closing_balance =
                      output[totalQuery !== "" ? 3 : 2][0]["cred_minus_deb"];
                  }
                  let lastAmount = 0;
                  let index = 0;
                  _.chain(result)
                    .groupBy((g) => g.payment_date)
                    .forEach((detail) => {
                      // for (let c = 0; c < detail.length; c++) {
                      //   const item = detail[c];
                      //   const idx = c;
                      //   let row_closing_balance = 0;
                      //   // console.log("item====>", item);
                      //   const debit_amt = parseFloat(item.debit_amount);
                      //   const credit_amt = parseFloat(item.credit_amount);
                      //   total_credit =
                      //     parseFloat(total_credit) +
                      //     parseFloat(item.credit_amount);
                      //   total_debit =
                      //     parseFloat(total_debit) +
                      //     parseFloat(item.debit_amount);
                      //   if (idx === 0 && index === 0) {
                      //     lastAmount =
                      //       parseFloat(lastAmount) +
                      //       parseFloat(opening_balance);
                      //   }
                      //   if (item.root_id === 1 || item.root_id === 5) {
                      //     if (debit_amt > 0) {
                      //       row_closing_balance =
                      //         parseFloat(lastAmount) + parseFloat(debit_amt);
                      //       if (credit_amt > 0) {
                      //         row_closing_balance =
                      //           row_closing_balance - credit_amt;
                      //       }
                      //     } else {
                      //       row_closing_balance =
                      //         parseFloat(lastAmount) - parseFloat(credit_amt);
                      //       if (debit_amt > 0) {
                      //         row_closing_balance =
                      //           row_closing_balance + debit_amt;
                      //       }
                      //     }
                      //   } else {
                      //     if (credit_amt > 0) {
                      //       row_closing_balance =
                      //         parseFloat(lastAmount) + parseFloat(credit_amt);
                      //       if (debit_amt > 0) {
                      //         row_closing_balance =
                      //           row_closing_balance - debit_amt;
                      //       }
                      //     } else {
                      //       row_closing_balance =
                      //         parseFloat(lastAmount) - parseFloat(debit_amt);
                      //       if (credit_amt > 0) {
                      //         row_closing_balance =
                      //           row_closing_balance + credit_amt;
                      //       }
                      //     }
                      //   }
                      //   lastAmount = parseFloat(row_closing_balance);
                      //   outputArray.push({
                      //     ...item,
                      //     voucher_type: _.startCase(item.voucher_type),
                      //     row_closing_balance:
                      //       parseFloat(row_closing_balance).toFixed(
                      //         decimal_places
                      //       ),
                      //   });
                      // }

                      detail.forEach((item, idx) => {
                        let row_closing_balance = 0;
                        const debit_amt = parseFloat(item.debit_amount);
                        const credit_amt = parseFloat(item.credit_amount);
                        if (idx === 0 && index === 0) {
                          lastAmount =
                            parseFloat(lastAmount) +
                            parseFloat(opening_balance);
                        }
                        if (item.root_id === 1 || item.root_id === 5) {
                          if (debit_amt > 0) {
                            row_closing_balance =
                              parseFloat(lastAmount) + parseFloat(debit_amt);
                            if (credit_amt > 0) {
                              row_closing_balance =
                                row_closing_balance - credit_amt;
                            }
                          } else {
                            row_closing_balance =
                              parseFloat(lastAmount) - parseFloat(credit_amt);
                            if (debit_amt > 0) {
                              row_closing_balance =
                                row_closing_balance + debit_amt;
                            }
                          }
                        } else {
                          if (credit_amt > 0) {
                            row_closing_balance =
                              parseFloat(lastAmount) + parseFloat(credit_amt);
                            if (debit_amt > 0) {
                              row_closing_balance =
                                row_closing_balance - debit_amt;
                            }
                          } else {
                            row_closing_balance =
                              parseFloat(lastAmount) - parseFloat(debit_amt);
                            if (credit_amt > 0) {
                              row_closing_balance =
                                row_closing_balance + credit_amt;
                            }
                          }
                        }
                        lastAmount = parseFloat(row_closing_balance);
                        outputArray.push({
                          ...item,
                          voucher_type: _.startCase(item.voucher_type),
                          row_closing_balance:
                            parseFloat(row_closing_balance).toFixed(
                              decimal_places
                            ),
                        });
                      });
                      index++;
                    })
                    .value();
                  //    console.log("===outputArray====", outputArray);

                  const totalRecords =
                    totalQuery !== "" ? output[1][0]["total_pages"] : undefined;
                  resolve({
                    details: outputArray,
                    account_name: result[0]["child_name"],
                    ledger_code: result[0]["ledger_code"],
                    total_debit: total_debit,
                    total_credit: total_credit,
                    CB_debit_side: CB_debit_side,
                    CB_credit_side: CB_credit_side,
                    final_balance: final_balance,
                    opening_balance: opening_balance,
                    closing_balance: closing_balance,
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
                } else {
                  resolve({
                    details: [],
                  });
                }
              })
              .catch((e) => {
                console.log("EEEE:", e);
                options.mysql.releaseConnection();
                next(e);
              });
          })
          .catch((e) => {
            console.log("EEEE6:", e);
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
