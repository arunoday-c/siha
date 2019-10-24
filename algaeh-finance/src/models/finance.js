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

    if (input.account_level >= 0 && input.finance_account_head_id > 0) {
      console.log("input:", input);
      _mysql
        .executeQuery({
          query: `with recursive cte (finance_account_head_id, account_name, parent_acc_id,
              finance_account_child_id,child_name,child_created_from,account_level,sort_order,head_id) as (
              
              select finance_account_head_id,account_name,parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,account_level,H.sort_order,CM.head_id
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              where finance_account_head_id=?
              
              union    
              
              select   H.finance_account_head_id,H.account_name,H.parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,H.account_level,H.sort_order,CM.head_id
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              inner join 
              cte
              on H.parent_acc_id = cte.finance_account_head_id       
              
              )
              select * from cte order by account_level,sort_order;`,

          printQuery: true,

          values: [input.finance_account_head_id]
        })
        .then(result => {
          _mysql.releaseConnection();

          const outputArray = createHierarchy(result);

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

  //created by irfan: to
  addAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "select finance_account_head_id,account_code,account_name,\
        account_level,hierarchy_path, concat(account_code,'.',(\
        select SUBSTRING_INDEX(account_code, '.', -1)+1\
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
        console.log("result:", result)

        const data = result[0][0];
        const sort_order = parseInt(result[1][0]["sort_order"]) + 1;

        console.log("sort_order:", sort_order)
        let account_code = 0;

        if (data["new_code"] == null) {
          account_code = data["account_code"] + "." + 1;
        } else {

          account_code = data["new_code"];
        }


        const account_name = input["account_name"];
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
              account_name,
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
            console.log("resul", resul)
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
};

// select finance_account_head_id,account_code,account_name, concat(account_code,'.',(
//   select SUBSTRING_INDEX(account_code, '.', -1)+1
//   FROM finance_account_head where parent_acc_id=10)) as new_code
//   FROM finance_account_head where finance_account_head_id=10;
function createHierarchy(arry) {
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
        head_id: item["head_id"],
        leafnode: "Y",
        created_status: item["child_created_from"]
      });

      const data = target.find(val => {
        return val.finance_account_head_id == item.finance_account_head_id;
      });

      if (!data) {
        target.push({
          ...item,
          title: item.account_name,
          created_status: item["head_created_from"],
          leafnode: "N"
        });
      }
    } else {
      target.push({ ...item, title: item.account_name, leafnode: "N" });
    }
  }

  // utilities.logger().log("roots:", roots);
  // utilities.logger().log("children:", children);

  // function to recursively build the tree
  let findChildren = function (parent) {
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

  return roots;
}

// with recursive cte (finance_account_head_id, account_name, parent_acc_id) as (
//   select    finance_account_head_id, account_name, parent_acc_id
//   from       finance_account_head  where      finance_account_head_id = 1
//   union all
//   select      H.finance_account_head_id,H.account_name,H.parent_acc_id
//   from       finance_account_head H
//   inner join cte
//           on H.parent_acc_id = cte.finance_account_head_id
// )
// select * from cte;

// function to recursively build the tree
//  let findChildren = function(parent) {
//   if (children[parent.finance_account_head_id]) {
//     parent.children = children[parent.finance_account_head_id];

//     for (let i = 0, len = parent.children.length; i < len; ++i) {
//       findChildren(parent.children[i]);
//     }
//   }
// };

// "select finance_account_head_id,account_code,account_name,\
//             H.created_from as head_created_from,account_level ,parent_acc_id,sort_order,\
//             C.finance_account_child_id,C.child_name,CM.head_id,CM.created_from as child_created_from,\
//             hierarchy_path FROM finance_account_head H left join \
//             finance_head_m_child CM on H.finance_account_head_id=CM.head_id\
//             left join finance_account_child C on CM.child_id=C.finance_account_child_id\
//             where account_code like '1%'\
//             order by account_level,sort_order            ;",
