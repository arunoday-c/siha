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
                query: `  select finance_voucher_header_id,voucher_type,voucher_no,
                      VD.head_id,VD.payment_date ,VD.child_id,               
                      ROUND(sum(debit_amount),${decimal_places}) as debit_amount,
                      ROUND(sum(credit_amount),${decimal_places})  as credit_amount,C.child_name
                      from finance_voucher_header H inner join finance_voucher_details VD
                      on H.finance_voucher_header_id=VD.voucher_header_id inner join finance_account_child C on
                      VD.child_id=C.finance_account_child_id where  VD.auth_status='A' and
                      VD.child_id=?  ${strQry} group by VD.payment_date,voucher_no order by VD.payment_date;   `,
                values: [input.child_id],
                printQuery: true
              })
              .then(result => {
                options.mysql.releaseConnection();
                let total_debit = parseFloat(0).toFixed(decimal_places);
                let total_credit = parseFloat(0).toFixed(decimal_places);
                if (result.length > 0) {
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

                  for (let i in dateWiseGroup) {
                    dateWiseGroup[i][0]["transaction_date"] = i;
                    outputArray.push(...dateWiseGroup[i]);
                  }

                  resolve({
                    details: outputArray,
                    account_name: result[0]["child_name"],
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
