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
        strQry = ` and VD.payment_date between date('${input.from_date}') and date('${input.to_date}') `;
      }

      if (input.leafnode == "Y") {
        options.mysql
          .executeQuery({
            query: `SELECT cost_center_type  FROM finance_options limit 1;`,
            values: [],
            printQuery: true
          })
          .then(resul => {
            //ST-cost center
            // if (
            //   resul[0]["cost_center_type"] == "P" &&
            //   input.cost_center_id > 0
            // ) {
            //   strQry += ` and project_id=${input.cost_center_id} `;
            // } else if (
            //   resul[0]["cost_center_type"] == "SD" &&
            //   input.cost_center_id > 0
            // ) {
            //   strQry += ` and sub_department_id=${input.cost_center_id} `;
            // }
            //END-cost center

            options.mysql
              .executeQuery({
                query: `  select finance_voucher_header_id,voucher_type,voucher_no,
                      VD.head_id,VD.payment_date ,VD.child_id, AH.root_id,              
                      ROUND(sum(debit_amount),${decimal_places}) as debit_amount,
                      ROUND(sum(credit_amount),${decimal_places})  as credit_amount,C.child_name,C.ledger_code
                      from finance_voucher_header H inner join finance_voucher_details VD
                      on H.finance_voucher_header_id=VD.voucher_header_id inner join finance_account_child C on
                      VD.child_id=C.finance_account_child_id inner join  finance_account_head AH on
                       C.head_id=AH.finance_account_head_id     where  VD.auth_status='A' and
                      VD.child_id=?  ${strQry} group by VD.payment_date,voucher_no order by VD.payment_date;
                      select  child_id,ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),2) as cred_minus_deb,
                      ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),2)  as deb_minus_cred
                      from   finance_voucher_details    where child_id=? and auth_status='A'  and payment_date < ?;
                      select  child_id,ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),2) as cred_minus_deb,
                      ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),2)  as deb_minus_cred
                      from   finance_voucher_details    where child_id=? and auth_status='A'  and payment_date <= ?;   `,
                values: [
                  input.child_id,
                  input.child_id,
                  input.from_date,
                  input.child_id,
                  input.to_date
                ],
                printQuery: true
              })
              .then(output => {
                let result = output[0];
                let opening_balance = parseFloat(0).toFixed(decimal_places);
                let closing_balance = parseFloat(0).toFixed(decimal_places);
                options.mysql.releaseConnection();
                let total_debit = parseFloat(0).toFixed(decimal_places);
                let total_credit = parseFloat(0).toFixed(decimal_places);
                if (result.length > 0) {
                  let CB_debit_side = null;
                  let CB_credit_side = null;
                  result.forEach(item => {
                    total_credit = (
                      parseFloat(total_credit) + parseFloat(item.credit_amount)
                    ).toFixed(decimal_places);
                    total_debit = (
                      parseFloat(total_debit) + parseFloat(item.debit_amount)
                    ).toFixed(decimal_places);
                  });

                  const dateWiseGroup = _.chain(result)
                    .groupBy(g => g.payment_date)
                    .value();

                  const outputArray = [];
                  let final_balance = "";

                  for (let i in dateWiseGroup) {
                    dateWiseGroup[i][0]["transaction_date"] = i;
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

                  resolve({
                    details: outputArray,
                    account_name: result[0]["child_name"],
                    total_debit: total_debit,
                    total_credit: total_credit,
                    CB_debit_side: CB_debit_side,
                    CB_credit_side: CB_credit_side,
                    final_balance: final_balance,
                    opening_balance: opening_balance,
                    closing_balance: closing_balance
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
