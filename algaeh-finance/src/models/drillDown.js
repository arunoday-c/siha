import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
export function generationLedger(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { head_id, child_id, parent_id, from_date, to_date } = req.query;
    let strQry = "";

    if (
      moment(from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
      moment(to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
    ) {
      strQry = ` and VD.payment_date between date('${from_date}') and date('${to_date}') `;
    }
    const { decimal_places } = req.userIdentity;
    _mysql
      .executeQuery({
        query: `SELECT cost_center_type  FROM finance_options limit 1;`,
        printQuery: true,
      })
      .then((result) => {
        _mysql
          .executeQuery({
            query: `  select finance_voucher_header_id,voucher_type,if(VD.is_opening_bal='Y','Opening Balance', voucher_no) as voucher_no,
                  VD.head_id,VD.payment_date, VD.child_id, AH.root_id,              
                  ROUND(sum(debit_amount),${decimal_places}) as debit_amount,
                  ROUND(sum(credit_amount),${decimal_places})  as credit_amount,C.child_name,C.ledger_code,
                  H.day_end_header_id,H.from_screen
                  from finance_voucher_header H right join finance_voucher_details VD
                  on H.finance_voucher_header_id=VD.voucher_header_id inner join finance_account_child C on
                  VD.child_id=C.finance_account_child_id inner join  finance_account_head AH on
                   C.head_id=AH.finance_account_head_id     where  VD.auth_status='A' and
                  VD.child_id=?  ${strQry} group by VD.payment_date,voucher_no, VD.head_id,VD.is_opening_bal order by VD.payment_date;
                  select  child_id,ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),2) as cred_minus_deb,
                  ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),2)  as deb_minus_cred
                  from   finance_voucher_details    where child_id=? and auth_status='A'  and payment_date < ?;
                  select  child_id,ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),2) as cred_minus_deb,
                  ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),2)  as deb_minus_cred
                  from   finance_voucher_details    where child_id=? and auth_status='A'  and payment_date <= ?;   `,
            values: [child_id, child_id, from_date, child_id, to_date],
            printQuery: true,
          })
          .then((output) => {
            _mysql.releaseConnection();
            let result = output[0];
            let opening_balance = parseFloat(0).toFixed(decimal_places);
            let closing_balance = parseFloat(0).toFixed(decimal_places);

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

              const dateWiseGroup = _.chain(result)
                .groupBy((g) => g.payment_date)
                .value();

              const outputArray = [];
              let final_balance = "";

              for (let i in dateWiseGroup) {
                // dateWiseGroup[i][0]["transaction_date"] = i;
                outputArray.push(...dateWiseGroup[i]);
              }

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

                opening_balance = output[1][0]["deb_minus_cred"];
                closing_balance = output[2][0]["deb_minus_cred"];
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

                opening_balance = output[1][0]["cred_minus_deb"];
                closing_balance = output[2][0]["cred_minus_deb"];
              }

              req.records = {
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
              };
              next();
            } else {
              _mysql.releaseConnection();
              req.records = {};
              next();
              //   resolve({
              //     details: [],
              //   });
            }
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
}

export function AginggenerationLedger(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { child_id, from_date, to_date, screen_type } = req.query;
    let strQry = "",
      strFiled = "";
    console.log("to_date", to_date);
    if (to_date == 0) {
      strQry = ` and H.due_date < date('${from_date}')`;
    } else if (
      moment(from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
      moment(to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
    ) {
      strQry = ` and H.due_date between date('${from_date}') and date('${to_date}') `;
    }
    if (screen_type === "receivable") {
      strFiled = `debit_amount`;
    } else {
      strFiled = `credit_amount`;
    }
    const { decimal_places } = req.userIdentity;
    _mysql
      .executeQuery({
        query: `SELECT cost_center_type  FROM finance_options limit 1;`,
        printQuery: true,
      })
      .then((result) => {
        _mysql
          .executeQuery({
            query: `  select finance_voucher_header_id,voucher_type,if(VD.is_opening_bal='Y','Opening Balance', voucher_no) as voucher_no,
                  VD.head_id,H.due_date, VD.child_id, AH.root_id,              
                  ROUND(sum(${strFiled}),${decimal_places}) as debit_amount,C.child_name,C.ledger_code,
                  H.day_end_header_id,H.from_screen
                  from finance_voucher_header H right join finance_voucher_details VD
                  on H.finance_voucher_header_id=VD.voucher_header_id inner join finance_account_child C on
                  VD.child_id=C.finance_account_child_id inner join  finance_account_head AH on
                   C.head_id=AH.finance_account_head_id     where  VD.auth_status='A' and
                  VD.child_id=?  ${strQry} group by H.due_date,voucher_no, VD.head_id,VD.is_opening_bal order by H.due_date;`,
            values: [child_id, child_id, from_date, child_id, to_date],
            printQuery: true,
          })
          .then((output) => {
            _mysql.releaseConnection();
            // let result = output[0];

            // let total_debit = parseFloat(0).toFixed(decimal_places);
            let total_amount = parseFloat(0).toFixed(decimal_places);
            if (output.length > 0) {
              // let CB_debit_side = null;
              // let CB_credit_side = null;
              // result.forEach((item) => {
              //   total_credit = (
              //     parseFloat(total_credit) + parseFloat(item.credit_amount)
              //   ).toFixed(decimal_places);
              //   total_debit = (
              //     parseFloat(total_debit) + parseFloat(item.debit_amount)
              //   ).toFixed(decimal_places);
              // });

              // const dateWiseGroup = _.chain(result)
              //   .groupBy((g) => g.payment_date)
              //   .value();

              // const outputArray = [];
              // let final_balance = "";

              // for (let i in dateWiseGroup) {
              //   // dateWiseGroup[i][0]["transaction_date"] = i;
              //   outputArray.push(...dateWiseGroup[i]);
              // }

              // if (result[0]["root_id"] == 1 || result[0]["root_id"] == 5) {
              //   const diffrence = parseFloat(
              //     total_debit - total_credit
              //   ).toFixed(decimal_places);
              //   if (diffrence > 0) {
              //     CB_credit_side = diffrence;
              //   } else {
              //     CB_debit_side = diffrence;
              //   }

              //   final_balance = total_debit;
              // } else {
              //   const diffrence = parseFloat(
              //     total_credit - total_debit
              //   ).toFixed(decimal_places);
              //   if (diffrence > 0) {
              //     CB_debit_side = diffrence;
              //   } else {
              //     CB_credit_side = diffrence;
              //   }
              //   final_balance = total_credit;
              // }

              total_amount = _.sumBy(output, (s) =>
                parseFloat(s.debit_amount)
              ).toFixed(decimal_places);

              req.records = {
                details: output,
                account_name: output[0]["child_name"],
                ledger_code: output[0]["ledger_code"],
                // total_debit: total_debit,
                // total_credit: total_credit,
                // CB_debit_side: CB_debit_side,
                // CB_credit_side: CB_credit_side,
                total_amount: total_amount,
              };
              next();
            } else {
              _mysql.releaseConnection();
              req.records = {};
              next();
              //   resolve({
              //     details: [],
              //   });
            }
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
}
