import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";

export default {
  //created by irfan:
  getPlComparison: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;

    const input = req.query;

    const from_date = input.from_date;
    const to_date = input.to_date;
    let prev_from_date = input.prev_from_date;
    let prev_to_date = input.prev_to_date;

    const columns = [];

    const default_total = parseFloat(0).toFixed(decimal_places);
    let trans_symbol = "Cr.";

    //ST-- GENERATING FIRST COLUMN ID
    const startYear = moment(from_date).format("YYYY");
    const endYear = moment(to_date).format("YYYY");

    if (startYear == endYear) {
      columns.push({
        column_id: "1",
        label:
          moment(from_date).format("DD MMM") +
          "-" +
          moment(to_date).format("DD MMM") +
          ", " +
          endYear,
      });
    } else {
      columns.push({
        column_id: "1",
        label:
          moment(from_date).format("DD MMM") +
          ", " +
          startYear +
          "-" +
          moment(to_date).format("DD MMM") +
          ", " +
          endYear,
      });
    }
    //END-- GENERATING FIRST COLUMN ID

    //ST-- GENERATING SECOND COLUMN ID
    const prev_startYear = moment(prev_from_date).format("YYYY");
    const prev_endYear = moment(prev_to_date).format("YYYY");

    if (prev_startYear == prev_endYear) {
      columns.push({
        column_id: "2",
        label:
          moment(prev_from_date).format("DD MMM") +
          "-" +
          moment(prev_to_date).format("DD MMM") +
          ", " +
          prev_endYear,
      });
    } else {
      columns.push({
        column_id: "2",
        label:
          moment(prev_from_date).format("DD MMM") +
          ", " +
          prev_startYear +
          "-" +
          moment(prev_to_date).format("DD MMM") +
          ", " +
          prev_endYear,
      });
    }
    //END-- GENERATING SECOND COLUMN ID

    //ST- display column change in amount

    if (input.change_in_amount == "Y") {
      columns.push({
        column_id: "change",
        label: "Change In Amount",
      });
    }

    //END- display column change in amount

    //ST- display column change in percentage

    if (input.change_in_percent == "Y") {
      columns.push({
        column_id: "percent",
        label: "% Change ",
      });
    }

    //END- display column change in percentage
    _mysql
      .executeQuery({
        query: ` with recursive cte as (
          select finance_account_head_id,account_code,account_name,       
          parent_acc_id from finance_account_head   where root_id=4
          union select H.finance_account_head_id,H.account_code,H.account_name,       
          H.parent_acc_id from finance_account_head H  
          inner join cte on H.parent_acc_id = cte.finance_account_head_id  
          )select * from cte ; 

          with recursive cte as (
          select finance_account_head_id,account_code,account_name,       
          parent_acc_id from finance_account_head   where root_id=5 and  account_code='5.1' 
          union select H.finance_account_head_id,H.account_code,H.account_name,       
          H.parent_acc_id from finance_account_head H  
          inner join cte on H.parent_acc_id = cte.finance_account_head_id  
          )select * from cte ;


        with recursive cte as (
        select finance_account_head_id,account_code,account_name,       
        parent_acc_id from finance_account_head   where root_id=5 and  account_code<>'5.1' 
        union select H.finance_account_head_id,H.account_code,H.account_name,       
        H.parent_acc_id from finance_account_head H  
        inner join cte on H.parent_acc_id = cte.finance_account_head_id  and H.account_code<>'5.1'
        )select * from cte ;        `,
      })
      .then((result) => {
        //Income head ids
        const income_head_ids = result[0].map((m) => m.finance_account_head_id);
        //direct expense or COGS
        const direct_expense_head_ids = result[1].map(
          (m) => m.finance_account_head_id
        );
        //indirect expense
        const indirect_expense_head_ids = result[2].map(
          (m) => m.finance_account_head_id
        );

        const expens = result[2].find((f) => f.account_code == 5);
        direct_expense_head_ids.push(expens.finance_account_head_id);

        const data = {
          _mysql,
          from_date,
          to_date,
          prev_from_date,
          prev_to_date,
          columns,
          decimal_places,
          default_total,
          trans_symbol,
          head_ids: income_head_ids,
        };

        getDataForProfitAndLoss(data)
          .then((incomeRes) => {
            data["head_ids"] = direct_expense_head_ids;
            data["trans_symbol"] = "Dr.";
            getDataForProfitAndLoss(data)
              .then((DirectRes) => {
                data["head_ids"] = indirect_expense_head_ids;
                getDataForProfitAndLoss(data)
                  .then((IndirectRes) => {
                    _mysql.releaseConnection();

                    let gross_profit = {};

                    gross_profit["1"] = (
                      parseFloat(incomeRes[0]["1"]) -
                      parseFloat(DirectRes[0]["1"])
                    ).toFixed(decimal_places);
                    gross_profit["2"] = (
                      parseFloat(incomeRes[0]["2"]) -
                      parseFloat(DirectRes[0]["2"])
                    ).toFixed(decimal_places);

                    let net_profit = {};

                    net_profit["1"] = (
                      parseFloat(gross_profit["1"]) -
                      parseFloat(IndirectRes[0]["1"])
                    ).toFixed(decimal_places);

                    net_profit["2"] = (
                      parseFloat(gross_profit["2"]) -
                      parseFloat(IndirectRes[0]["2"])
                    ).toFixed(decimal_places);

                    req.records = {
                      columns,
                      income: incomeRes[0],
                      Direct_expense: DirectRes[0]["children"][0],
                      Indirect_expense: IndirectRes[0]["children"],
                      gross_profit,
                      net_profit,
                    };
                    next();
                  })
                  .catch((e) => {
                    _mysql.releaseConnection();
                    next(e);
                  });
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};

//created by irfan:
function getDataForProfitAndLoss(options) {
  try {
    return new Promise((resolve, reject) => {
      const {
        _mysql,
        from_date,
        to_date,
        prev_from_date,
        prev_to_date,
        columns,
        trans_symbol,
        default_total,
        decimal_places,
        head_ids,
      } = options;

      _mysql
        .executeQuery({
          query: ` select finance_account_head_id,account_code,account_name,account_parent,account_level,sort_order,parent_acc_id,root_id,  
                  finance_account_child_id, child_name,head_id from finance_account_head H left join finance_account_child C on
                  C.head_id=H.finance_account_head_id where H.finance_account_head_id in (${head_ids}) order by account_level,sort_order;  
                  
                  select max(account_level) as account_level from finance_account_head 
                  where  finance_account_head_id in (${head_ids});

                  select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,
                  account_name,account_level ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                  ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                  from finance_account_head H              
                  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id 
                  and VD.auth_status='A' and VD.payment_date between date('${from_date}') and date('${to_date}')
                  where H.finance_account_head_id in(${head_ids})
                  group by H.finance_account_head_id   order by account_level; 
        
                  select C.head_id,finance_account_child_id as child_id   
                  ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                  ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                  ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                  ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                  from   finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
                  and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and 
                  date('${to_date}') where C.head_id in(${head_ids}) group by C.finance_account_child_id ; 
                  
                  select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,
                  account_name,account_level ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                  ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                  from finance_account_head H              
                  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id 
                  and VD.auth_status='A' and VD.payment_date between date('${prev_from_date}') and date('${prev_to_date}')
                  where H.finance_account_head_id in(${head_ids})
                  group by H.finance_account_head_id   order by account_level; 
        
                  select C.head_id,finance_account_child_id as child_id   
                  ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                  ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                  ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                  ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                  from   finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
                  and VD.auth_status='A'   and VD.payment_date between date('${prev_from_date}') and 
                  date('${prev_to_date}') where C.head_id in(${head_ids}) group by C.finance_account_child_id ; `,
          printQuery: true,
        })
        .then((result) => {
          const headObj = {};
          const childObj = {};

          let res = 0;
          let column_id = 0;
          for (let i = 0; i < 2; i++) {
            res += 2;
            column_id += 1;
            let head_data = calcAmountForProfitAndLoss(
              result[res],
              result[1],
              decimal_places
            );
            headObj[column_id] = head_data;
            childObj[column_id] = result[res + 1];
          }

          const outputArray = buildHierarchyForProfitAndLoss(
            result[0],
            childObj,
            headObj,
            trans_symbol,
            default_total,
            decimal_places
          );
          resolve(outputArray);
        })
        .catch((e) => {
          console.log("e:", e);
          _mysql.releaseConnection();
          next(e);
        });
    });
  } catch (e) {
    console.log("e:", e);
  }
}

//created by :IRFAN to calculate the amount of account heads
function calcAmountForProfitAndLoss(account_heads, levels, decimal_places) {
  try {
    const max_account_level = parseInt(levels[0]["account_level"]);

    let levels_group = _.chain(account_heads)
      .groupBy((g) => g.account_level)
      .value();

    levels_group[max_account_level].map((m) => {
      m["total_debit_amount"] = m["debit_amount"];
      m["total_credit_amount"] = m["credit_amount"];

      m["cred_minus_deb"] = parseFloat(
        parseFloat(m["credit_amount"]) - parseFloat(m["debit_amount"])
      ).toFixed(decimal_places);
      m["deb_minus_cred"] = parseFloat(
        parseFloat(m["debit_amount"]) - parseFloat(m["credit_amount"])
      ).toFixed(decimal_places);
      return m;
    });

    for (let i = max_account_level - 1; i >= 0; i--) {
      // for (let k = 0; k < levels_group[i].length; k++) {
      levels_group[i].map((item) => {
        let immediate_childs = levels_group[i + 1].filter((child) => {
          if (item.finance_account_head_id == child.parent_acc_id) {
            return item;
          }
        });

        const total_debit_amount = _.chain(immediate_childs)
          .sumBy((s) => parseFloat(s.total_debit_amount))
          .value()
          .toFixed(decimal_places);

        const total_credit_amount = _.chain(immediate_childs)
          .sumBy((s) => parseFloat(s.total_credit_amount))
          .value()
          .toFixed(decimal_places);

        item["total_debit_amount"] = parseFloat(
          parseFloat(item["debit_amount"]) + parseFloat(total_debit_amount)
        ).toFixed(decimal_places);

        item["total_credit_amount"] = parseFloat(
          parseFloat(item["credit_amount"]) + parseFloat(total_credit_amount)
        ).toFixed(decimal_places);

        item["cred_minus_deb"] = parseFloat(
          parseFloat(item["total_credit_amount"]) -
            parseFloat(item["total_debit_amount"])
        ).toFixed(decimal_places);
        item["deb_minus_cred"] = parseFloat(
          parseFloat(item["total_debit_amount"]) -
            parseFloat(item["total_credit_amount"])
        ).toFixed(decimal_places);

        return item;
      });
      // }
    }
    const final_res = [];

    let len = Object.keys(levels_group).length;

    for (let i = 0; i < len; i++) {
      final_res.push(...levels_group[i]);
    }
    return final_res;
  } catch (e) {
    console.log("am55:", e);
    reject(e);
  }
}

//created by :IRFAN to build tree hierarchy
function buildHierarchyForProfitAndLoss(
  arry,
  child_data,
  head_data,
  trans_symbol,
  default_total,
  decimal_places
) {
  try {
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

        let columns_wise_amounts = {};

        for (let child in child_data) {
          //ST---calulating Amount
          const BALANCE = child_data[child].find((f) => {
            return (
              item.finance_account_head_id == f.head_id &&
              item.finance_account_child_id == f.child_id
            );
          });

          let amount = 0;
          if (BALANCE != undefined) {
            if (trans_symbol == "Dr.") {
              amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );

              columns_wise_amounts[child] = amount;
            } else {
              amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );

              columns_wise_amounts[child] = amount;
            }
          }
        }
        let changed_amount = parseFloat(
          columns_wise_amounts["1"] - columns_wise_amounts["2"]
        ).toFixed(decimal_places);
        let percent = (
          parseFloat(changed_amount / columns_wise_amounts["2"]) * 100
        ).toFixed(decimal_places);

        //END---calulating Amount
        child.push({
          finance_account_child_id: item["finance_account_child_id"],
          trans_symbol: trans_symbol,
          ...columns_wise_amounts,

          label: item.child_name,
          head_id: item["head_id"],

          leafnode: "Y",
          change: changed_amount,
          percent: percent,
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        if (!data) {
          let columns_wise_amounts = {};
          //ST---calulating Amount
          for (let head in head_data) {
            const BALANCE = head_data[head].find((f) => {
              return item.finance_account_head_id == f.finance_account_head_id;
            });

            let amount = 0;
            if (BALANCE != undefined) {
              if (trans_symbol == "Dr.") {
                amount = BALANCE.deb_minus_cred;

                columns_wise_amounts[head] = amount;
              } else {
                amount = BALANCE.cred_minus_deb;

                columns_wise_amounts[head] = amount;
              }
            }
          }

          //END---calulating Amount

          let changed_amount = parseFloat(
            columns_wise_amounts["1"] - columns_wise_amounts["2"]
          ).toFixed(decimal_places);

          let percent = (
            parseFloat(changed_amount / columns_wise_amounts["2"]) * 100
          ).toFixed(decimal_places);
          target.push({
            ...item,
            trans_symbol: trans_symbol,
            ...columns_wise_amounts,
            label: item.account_name,
            leafnode: "N",
            change: changed_amount,
            percent: percent,
          });
        }
      } else {
        let columns_wise_amounts = {};
        //ST---calulating Amount
        for (let head in head_data) {
          const BALANCE = head_data[head].find((f) => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });

          let amount = 0;
          if (BALANCE != undefined) {
            if (trans_symbol == "Dr.") {
              amount = BALANCE.deb_minus_cred;

              columns_wise_amounts[head] = amount;
            } else {
              amount = BALANCE.cred_minus_deb;

              columns_wise_amounts[head] = amount;
            }
          }
        }

        //END---calulating Amount

        let changed_amount = parseFloat(
          columns_wise_amounts["1"] - columns_wise_amounts["2"]
        ).toFixed(decimal_places);

        let percent = (
          parseFloat(changed_amount / columns_wise_amounts["2"]) * 100
        ).toFixed(decimal_places);
        target.push({
          ...item,
          trans_symbol: trans_symbol,
          ...columns_wise_amounts,
          label: item.account_name,
          leafnode: "N",
          change: changed_amount,
          percent: percent,
        });
      }
    }

    // function to recursively build the tree
    let findChildren = function (parent) {
      if (children[parent.finance_account_head_id]) {
        const tempchilds = children[parent.finance_account_head_id];

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
  } catch (e) {
    console.log("MY-ERORR:", e);
  }
}
