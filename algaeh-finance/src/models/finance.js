import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";

import algaehUtilities from "algaeh-utilities/utilities";

import mysql from "mysql";

export default {
  //created by irfan: to mark absent
  getAccountHeadsBKP: (req, res, next) => {
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
                  child_created_from: data["child_created_from"],
                  account_level: data["account_level"]
                });
              } else if (i == 0) {
                outputArray.push({
                  leafnode: "N",
                  finance_account_head_id: data["finance_account_head_id"],
                  account_code: data["account_code"],
                  account_name: data["account_name"],
                  head_created_from: data["head_created_from"],
                  account_level: data["account_level"]
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
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input"
      };
    }
  },
  //created by irfan: to mark absent
  getAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    if (
      (input.finance_account_head_id > 0 &&
        input.finance_account_head_id < 5) ||
      (input.childs_of != "N" && input.childs_of != undefined)
    ) {
      // input["childs_of"] = "A";
      console.log("input:", input);
      let finance_account_head_id = "";

      if (input.childs_of != "N" && input.childs_of != undefined) {
        switch (input.childs_of) {
          case "A":
            finance_account_head_id = 1;
            break;

          case "L":
            finance_account_head_id = 2;
            break;
          case "I":
            finance_account_head_id = 3;
            break;
          case "C":
            finance_account_head_id = 4;
            break;
        }
      } else {
        finance_account_head_id = input.finance_account_head_id;
      }
      _mysql
        .executeQuery({
          query: `with recursive cte (finance_account_head_id, account_name, parent_acc_id,
              finance_account_child_id,child_name,child_created_from,account_level,sort_order,head_id,created_status) as (
              
              select finance_account_head_id,account_name,parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,account_level,H.sort_order,CM.head_id,H.created_from as created_status
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              where finance_account_head_id=?
              
              union    
              
              select   H.finance_account_head_id,H.account_name,H.parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,H.account_level,H.sort_order,CM.head_id,H.created_from as created_status
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              inner join 
              cte
              on H.parent_acc_id = cte.finance_account_head_id       
              
              )
              select * from cte order by account_level,sort_order;`,

          printQuery: true,

          values: [finance_account_head_id]
        })
        .then(result => {
          _mysql.releaseConnection();

          const outputArray = createHierarchy(result, input.childs_of);

          req.records = outputArray;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input"
      };
      next();
    }
  },

  //created by irfan: to
  addAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQueryWithTransaction({
          query: "INSERT INTO `finance_account_child` (child_name)  VALUE(?)",
          values: [input.account_name],
          printQuery: true
        })
        .then(result => {
          if (result.insertId > 0) {
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `finance_head_m_child` (head_id,child_id,created_from)  VALUE(?,?,?)",
                values: [input.finance_account_head_id, result.insertId, "U"],
                printQuery: true
              })
              .then(detail => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = detail;
                  next();
                });
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            req.records = {
              invalid_input: true,
              message: "Please provide valid input"
            };

            _mysql.rollBackTransaction(() => {
              next();
            });
          }
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } else {
      _mysql
        .executeQuery({
          query:
            "select finance_account_head_id,account_code,account_name,\
        account_level,hierarchy_path, concat(account_code,'.',(\
        select SUBSTRING_INDEX(max(account_code), '.', -1)+1\
        FROM finance_account_head where parent_acc_id=?)) as new_code\
        FROM finance_account_head where finance_account_head_id=?;\
        select coalesce(max(sort_order),0)as sort_order FROM finance_account_head where parent_acc_id=?;",
          values: [
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id
          ],
          printQuery: true
        })
        .then(result => {
          console.log("result:", result);

          const data = result[0][0];
          const sort_order = parseInt(result[1][0]["sort_order"]) + 1;

          console.log("sort_order:", sort_order);
          let account_code = 0;

          if (data["new_code"] == null) {
            account_code = data["account_code"] + "." + 1;
          } else {
            account_code = data["new_code"];
          }

          const account_parent = data["account_code"];
          const group_type = "C";
          const account_level = parseInt(data["account_level"]) + 1;
          const created_from = "U";
          const parent_acc_id = input.finance_account_head_id;
          const hierarchy_path =
            data["hierarchy_path"] + "," + input.finance_account_head_id;

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `finance_account_head` (account_code,account_name,account_parent,\
                group_type,account_level,created_from,sort_order,parent_acc_id,hierarchy_path)\
        VALUE(?,?,?,?,?,?,?,?,?)",
              values: [
                account_code,
                input.account_name,
                account_parent,
                group_type,
                account_level,
                created_from,
                sort_order,
                parent_acc_id,
                hierarchy_path
              ],
              printQuery: true
            })
            .then(resul => {
              console.log("resul", resul);
              _mysql.releaseConnection();
              req.records = resul;
              next();
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
  },
  //created by irfan: to
  updateFinanceAccountsMaping: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;
    let strQry = "";

    input.forEach(item => {
      strQry += `update finance_accounts_maping set child_id=${item.child_id},head_id=${item.head_id},
      head_account_code=(select account_code from finance_account_head where finance_account_head_id =${item.head_id} limit 1)
       where account=${item.account};`;
    });

    if (strQry != "") {
      _mysql
        .executeQuery({
          query: strQry,

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please Provide valid input"
      };
      next();
    }
  },
  //created by irfan: to
  getFinanceAccountsMaping: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();

    _mysql
      .executeQuery({
        query:
          "select account,child_id,head_id,H.account_name,C.child_name from \
          finance_accounts_maping M left join finance_account_head H\
          on M.head_id=H.finance_account_head_id left join finance_account_child C \
          on M.child_id=C.finance_account_child_id ;",

        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  getDayEndData: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.query;

    let strQry = "";

    if (input.document_number !== undefined && input.document_number == null) {
      strQry += ` and  H.document_number='${input.document_number}'`;
    }
    if (
      input.transaction_type !== undefined &&
      input.transaction_type == null
    ) {
      strQry += ` and H.transaction_type='${input.transaction_type}'`;
    }
    _mysql
      .executeQuery({
        query: `select SD.finance_day_end_sub_detail_id,D.finance_day_end_detail_id ,H.transaction_date,case D.payment_mode when 'CA' then\
          'CASH' when 'CH' then 'CHEQUE' when 'CD' then 'CARD'  end as payment_mode ,D.amount,SD.narration,\
          H.document_type,H.document_number,case H.transaction_type when 'AD' then 'ADVANCE' \
          when 'RF' then 'REFUND' end as transaction_type ,S.screen_name from finance_day_end_header H inner join\
          finance_day_end_detail D on H.finance_day_end_header_id=D.day_end_header_id \
          inner join finance_day_end_sub_detail SD on D.finance_day_end_detail_id=SD.day_end_detail_id\
          left join  algaeh_d_app_screens S on H.from_screen=S.screen_code\
          where  SD.posted='N' and H.transaction_date between date(?) and  date(?)  ${strQry};`,
        values: [input.from_date, input.to_date],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  postDayEndData: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;

    console.log("input:",input)

    _mysql
      .executeQuery({
        query: `  WITH cte_  AS (
          SELECT finance_day_end_sub_detail_id, day_end_detail_id, payment_date, head_account_code,
          sum(debit_amount),sum(credit_amount) ,case when sum(debit_amount)= sum(credit_amount)then
          'true' else 'false'end as is_equal FROM finance_day_end_sub_detail
          where posted='N' and day_end_detail_id in (?)
          group by day_end_detail_id)
          select * from finance_day_end_sub_detail where day_end_detail_id in (SELECT day_end_detail_id
           FROM cte_ where is_equal='true');`,
        values: [input.finance_day_end_detail_ids],
        printQuery: true
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();
        if (result.length > 0) {
          const updateFinanceDayEndDetailIds = result.map(
            m => {
              return m.finance_day_end_sub_detail_id;
            }
          );
          console.log("updateFinanceDayEndDetailIds:",updateFinanceDayEndDetailIds)
          const insertColumns = [
            "payment_date",
            "head_account_code",
            "head_id",
            "child_id",
            "debit_amount",
            "credit_amount",
            "payment_type",
            "narration",
            "hospital_id"
          ];
          _mysql
            .executeQueryWithTransaction({
              query: "insert into finance_voucher_details (??) values ?;",
              values: result,
              includeValues: insertColumns,
              bulkInsertOrUpdate: true,
              printQuery:true
            })
            .then(result2 => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "update finance_day_end_sub_detail set posted='Y' ,posted_date=now(),\
                posted_by=? where   finance_day_end_sub_detail_id in (?) ",
                  values: [
                    req.userIdentity.algaeh_d_app_user_id,
                    updateFinanceDayEndDetailIds
                  ],
                  printQuery: false
                })
                .then(result3 => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result3;
                    next();
                  });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          _mysql.releaseConnection();

          req.records = {
            invalid_input: true,
            message: "No records found to post"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  }
};

function createHierarchy(arry, childs_of) {
  const onlyChilds = [];
  const utilities = new algaehUtilities();
  let roots = [],
    children = {};

  // find the top level nodes and hash the children based on parent_acc_id
  for (let i = 0, len = arry.length; i < len; ++i) {
    let item = arry[i],
      p = item.parent_acc_id,
      //if it has no parent_acc_id
      //seprating roots to roots array childerens to childeren array
      target = !p ? roots : children[p] || (children[p] = []);

    if (
      item.finance_account_child_id > 0 &&
      item.finance_account_head_id == item.head_id
    ) {
      let child =
        children[item.finance_account_head_id] ||
        (children[item.finance_account_head_id] = []);
      child.push({
        finance_account_child_id: item["finance_account_child_id"],
        title: item.child_name,
        label: item.child_name,
        head_id: item["head_id"],
        disabled: false,
        leafnode: "Y",
        created_status: item["child_created_from"]
      });

      if (childs_of != undefined && childs_of != "N") {
        onlyChilds.push({
          finance_account_child_id: item["finance_account_child_id"],
          title: item.child_name,
          label: item.child_name,
          head_id: item["head_id"],
          disabled: false,
          leafnode: "Y",
          created_status: item["child_created_from"]
        });
      }

      const data = target.find(val => {
        return val.finance_account_head_id == item.finance_account_head_id;
      });

      if (!data) {
        target.push({
          ...item,
          title: item.account_name,
          label: item.account_name,
          disabled: true,
          leafnode: "N"
        });
      }
    } else {
      target.push({
        ...item,
        title: item.account_name,
        label: item.account_name,
        disabled: true,
        leafnode: "N"
      });
    }
  }

  // utilities.logger().log("roots:", roots);
  // utilities.logger().log("children:", children);

  // function to recursively build the tree
  let findChildren = function(parent) {
    if (children[parent.finance_account_head_id]) {
      const tempchilds = children[parent.finance_account_head_id];
      // let child = [];
      // tempchilds.forEach((item, i) => {
      //   if (item.finance_account_head_id > 0) {
      //     child.push({
      //       ...item,
      //       title: item.account_name
      //     });
      //   } else if (item.finance_account_child_id > 0) {
      //     child.push({
      //       ...item,
      //       title: item.child_name
      //     });
      //   }
      // });
      parent.children = tempchilds;

      for (let i = 0, len = parent.children.length; i < len; ++i) {
        findChildren(parent.children[i]);
      }
    }
  };

  // enumerate through to handle the case where there are multiple roots
  for (let i = 0, len = roots.length; i < len; ++i) {
    findChildren(roots[i]);
  }

  if (childs_of != undefined && childs_of != "N") {
    return onlyChilds;
  } else {
    return roots;
  }
}

// WITH cte_name  AS (
//   SELECT finance_day_end_sub_detail_id, day_end_detail_id, payment_date, head_account_code,
//   sum(debit_amount),sum(credit_amount) ,case when sum(debit_amount)= sum(credit_amount)then
//   'true' else 'false'end as is_equal FROM hims_test_db.finance_day_end_sub_detail
//   where posted='N' and  payment_date between date('2019-10-30') and date('2019-10-31')
//   group by day_end_detail_id)
//   select * from finance_day_end_sub_detail where day_end_detail_id in (SELECT day_end_detail_id
//    FROM cte_name where is_equal='true');
