import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";

import algaehUtilities from "algaeh-utilities/utilities";

import mysql from "mysql";

export default {
  //created by irfan: to mark absent
  getAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    if (input.account_level >= 0 && input.finance_account_head_id > 0) {
      console.log("input:", input);
      _mysql
        .executeQuery({
          query:
            "select finance_account_head_id,account_code,account_name,\
            H.created_from as head_created_from,account_level ,parent_acc_id,\
            C.finance_account_child_id,C.child_name,CM.created_from as child_created_from\
            FROM finance_account_head H left join \
            finance_head_m_child CM on H.finance_account_head_id=CM.head_id\
            left join finance_account_child C on CM.child_id=C.finance_account_child_id\
            where (parent_acc_id=? and account_level=?) or (CM.head_id=?)\
            order by sort_order;",
          values: [
            input.finance_account_head_id,
            parseInt(input.account_level) + 1,
            input.finance_account_head_id
          ],
          printQuery: true
        })
        .then(result => {
          // console.log("result:", result);
          _mysql.releaseConnection();

          const allHeads = _.chain(result)
            .groupBy(g => g.finance_account_head_id)
            .map(emp => {
              return emp;
            })
            .value();

          const outputArray = [];

          allHeads.forEach(item => {
            item.forEach((data, i) => {
              if (
                data["finance_account_head_id"] ==
                  input.finance_account_head_id &&
                data["finance_account_head_id"] > 0
              ) {
                outputArray.push({
                  leafnode: "Y",
                  finance_account_child_id: data["finance_account_child_id"],
                  child_name: data["child_name"],
                  child_created_from: data["child_created_from"]
                });
              } else if (i == 0) {
                outputArray.push({
                  leafnode: "N",
                  finance_account_head_id: data["finance_account_head_id"],
                  account_code: data["account_code"],
                  account_name: data["account_name"],
                  head_created_from: data["head_created_from"]
                });
              }
            });
          });

          req.records = outputArray;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  }
};
