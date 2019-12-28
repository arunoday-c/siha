import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getBalanceSheet: (req, res, next) => {
    const decimal_places = req.userIdentity.decimal_places;
    getAccountHeadsForReport(decimal_places, 1)
      .then(asset => {
        getAccountHeadsForReport(decimal_places, 2)
          .then(liabilities => {
            getAccountHeadsForReport(decimal_places, 3)
              .then(equity => {
                // const balance = parseFloat(
                //   parseFloat(asset.subtitle) - parseFloat(liabilities.subtitle)
                // ).toFixed(decimal_places);

                // let symbol = " Dr";
                // if (balance < 0) {
                //   symbol = " Cr";
                // }

                liabilities.children.push(equity);
                liabilities.label = "Liabilities and Equity";
                liabilities.subtitle = parseFloat(
                  parseFloat(liabilities.subtitle) + parseFloat(equity.subtitle)
                ).toFixed(decimal_places);
                req.records = {
                  asset: asset,
                  liabilities: liabilities
                };
                next();
              })
              .catch(e => {
                next(e);
              });
          })
          .catch(e => {
            next(e);
          });
      })
      .catch(e => {
        next(e);
      });
  },
  //created by irfan:
  getProfitAndLoss: (req, res, next) => {
    const decimal_places = req.userIdentity.decimal_places;

    getAccountHeadsForReport(decimal_places, 4)
      .then(income => {
        getAccountHeadsForReport(decimal_places, 5)
          .then(expense => {
            const balance = parseFloat(
              parseFloat(income.subtitle) - parseFloat(expense.subtitle)
            ).toFixed(decimal_places);

            req.records = {
              profit: balance,
              income: income,
              expense: expense
            };
            next();
          })
          .catch(e => {
            next(e);
          });
      })
      .catch(e => {
        next(e);
      });
  },
  //created by irfan:
  getTrialBalance: (req, res, next) => {
    const decimal_places = req.userIdentity.decimal_places;

    getAccountHeadsForReport(decimal_places, 1)
      .then(asset => {
        getAccountHeadsForReport(decimal_places, 2)
          .then(liability => {
            getAccountHeadsForReport(decimal_places, 3)
              .then(capital => {
                const newCapital = capital.children[0].children.find(f => {
                  return f.finance_account_child_id == 52;
                });
                getAccountHeadsForReport(decimal_places, 4)
                  .then(income => {
                    getAccountHeadsForReport(decimal_places, 5)
                      .then(expense => {
                        const total_debit_amount = parseFloat(
                          parseFloat(asset.subtitle) +
                            parseFloat(expense.subtitle)
                        ).toFixed(decimal_places);
                        const total_credit_amount = parseFloat(
                          parseFloat(newCapital.subtitle) +
                            parseFloat(income.subtitle) +
                            parseFloat(liability.subtitle)
                        ).toFixed(decimal_places);

                        req.records = {
                          asset: asset,
                          liability: liability,
                          capital: newCapital,
                          income: income,
                          expense: expense,
                          total_debit_amount: total_debit_amount,
                          total_credit_amount: total_credit_amount
                        };
                        next();
                      })
                      .catch(e => {
                        next(e);
                      });
                  })
                  .catch(e => {
                    next(e);
                  });
              })
              .catch(e => {
                next(e);
              });
          })
          .catch(e => {
            next(e);
          });
      })
      .catch(e => {
        next(e);
      });
  }
};

//created by irfan:
function getAccountHeadsForReport(decimal_places, finance_account_head_id) {
  const utilities = new algaehUtilities();
  const _mysql = new algaehMysql();

  return new Promise((resolve, reject) => {
    if (finance_account_head_id > 0 && finance_account_head_id < 6) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (finance_account_head_id == 1 || finance_account_head_id == 5) {
        trans_symbol = "Dr.";
      }

      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code,account_name,account_parent,account_level,
          H.created_from as created_status ,sort_order,parent_acc_id,root_id,
          finance_account_child_id,child_name,head_id,C.created_from as child_created_from
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id
           where (root_id=? or finance_account_head_id=?) order by account_level,sort_order;           
           select C.head_id,finance_account_child_id as child_id,child_name
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount, 
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='Y'
          where (H.root_id=? or H.finance_account_head_id=?)
          group by C.finance_account_child_id;
          select max(account_level) as account_level from finance_account_head 
          where (root_id=? or finance_account_head_id=?);
          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount
          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='Y'
          where (H.root_id=? or H.finance_account_head_id=?)
          group by H.finance_account_head_id  order by account_level;  `,

          values: [
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();

          const child_data = result[1];

          calcAmount(result[3], result[2], decimal_places)
            .then(head_data => {
              const outputArray = createHierarchy(
                result[0],
                child_data,
                head_data,
                trans_symbol,
                default_total,
                decimal_places
              );

              resolve(outputArray[0]);
            })
            .catch(e => {
              console.log("m4:", e);
              next(e);
            });
        })
        .catch(e => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input"
      });
    }
  });
}
//created by irfan:
function getAccountHeadsForReport_BKP_24_dec(
  decimal_places,
  finance_account_head_id
) {
  const utilities = new algaehUtilities();
  const _mysql = new algaehMysql();

  return new Promise((resolve, reject) => {
    if (finance_account_head_id > 0 && finance_account_head_id < 6) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (finance_account_head_id == 1 || finance_account_head_id == 5) {
        trans_symbol = "Dr.";
      }

      _mysql
        .executeQuery({
          query: `with recursive cte (finance_account_head_id,account_code, account_name, parent_acc_id,
              finance_account_child_id,child_name,child_created_from,account_level,sort_order,head_id,created_status) as (              
              select finance_account_head_id,H.account_code,account_name,parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,account_level,H.sort_order,CM.head_id,H.created_from as created_status
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              where finance_account_head_id =?             
              union                  
              select   H.finance_account_head_id,H.account_code,H.account_name,H.parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,H.account_level,H.sort_order,CM.head_id,H.created_from as created_status
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              inner join 
              cte
              on H.parent_acc_id = cte.finance_account_head_id       
              
              )
              select * from cte order by account_level,sort_order;              
              select head_account_code,head_id,	child_id,coalesce(sum(debit_amount) ,0.0000) as debit_amount,
              coalesce(sum(credit_amount) ,0.0000) as credit_amount, 
              (coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) )as cred_minus_deb,
              (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)) as deb_minus_cred
              from finance_voucher_details where head_id 
              in ( with recursive cte  as (          
                select  finance_account_head_id
                from finance_account_head where finance_account_head_id =?
                union                  
                select H.finance_account_head_id
                from finance_account_head  H inner join cte
                on H.parent_acc_id = cte.finance_account_head_id    
                )select * from cte)
              group by head_id,child_id; 
                  
              with recursive cte  as (select finance_account_head_id,account_level
                FROM finance_account_head where finance_account_head_id =?
                union
                select H.finance_account_head_id,H.account_level FROM finance_account_head H
                inner join cte on H.parent_acc_id = cte.finance_account_head_id       
                )
                select max(account_level) as account_level from cte ;
  
                select finance_account_head_id,account_code,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,
                coalesce(sum(debit_amount),0.0000)as debit_amount,coalesce(sum(credit_amount),0.000)as credit_amount
                from finance_account_head  H left join finance_voucher_details VD on H.finance_account_head_id=VD.head_id        
                where finance_account_head_id  
                in ( with recursive cte  as (          
                select  finance_account_head_id
                from finance_account_head where finance_account_head_id =?
                union                  
                select H.finance_account_head_id
                from finance_account_head  H inner join cte
                on H.parent_acc_id = cte.finance_account_head_id    
                )select * from cte)
                group by finance_account_head_id order by account_level;   `,

          printQuery: false,

          values: [
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();

          const child_data = result[1];

          calcAmount(result[3], result[2], decimal_places)
            .then(head_data => {
              const outputArray = createHierarchy(
                result[0],
                child_data,
                head_data,
                trans_symbol,
                default_total,
                decimal_places
              );

              resolve(outputArray[0]);
            })
            .catch(e => {
              console.log("m4:", e);
              next(e);
            });
        })
        .catch(e => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input"
      });
    }
  });
}

//created by :IRFAN to calculate the amount of account heads
function calcAmount(account_heads, levels, decimal_places) {
  try {
    return new Promise((resolve, reject) => {
      const max_account_level = parseInt(levels[0]["account_level"]);

      let levels_group = _.chain(account_heads)
        .groupBy(g => g.account_level)
        .value();

      levels_group[max_account_level].map(m => {
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
        for (let k = 0; k < levels_group[i].length; k++) {
          levels_group[i].map(item => {
            let immediate_childs = levels_group[i + 1].filter(child => {
              if (item.finance_account_head_id == child.parent_acc_id) {
                return item;
              }
            });

            const total_debit_amount = _.chain(immediate_childs)
              .sumBy(s => parseFloat(s.total_debit_amount))
              .value()
              .toFixed(decimal_places);

            const total_credit_amount = _.chain(immediate_childs)
              .sumBy(s => parseFloat(s.total_credit_amount))
              .value()
              .toFixed(decimal_places);

            item["total_debit_amount"] = parseFloat(
              parseFloat(item["debit_amount"]) + parseFloat(total_debit_amount)
            ).toFixed(decimal_places);

            item["total_credit_amount"] = parseFloat(
              parseFloat(item["credit_amount"]) +
                parseFloat(total_credit_amount)
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
        }
      }
      const final_res = [];

      let len = Object.keys(levels_group).length;

      for (let i = 0; i < len; i++) {
        final_res.push(...levels_group[i]);
      }
      resolve(final_res);
    });
  } catch (e) {
    console.log("am55:", e);
    reject(e);
  }
}

//created by :IRFAN to build tree hierarchy
function createHierarchy(
  arry,
  child_data,
  head_data,
  trans_symbol,
  default_total,
  decimal_places
) {
  try {
    // const onlyChilds = [];
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

        //ST---calulating Amount
        const BALANCE = child_data.find(f => {
          return (
            item.finance_account_head_id == f.head_id &&
            item.finance_account_child_id == f.child_id
          );
        });

        let amount = 0;
        if (BALANCE != undefined) {
          if (trans_symbol == "Dr.") {
            amount = parseFloat(BALANCE.deb_minus_cred).toFixed(decimal_places);
          } else {
            amount = parseFloat(BALANCE.cred_minus_deb).toFixed(decimal_places);
          }

          // if (trans_symbol == "Dr.") {
          //   amount = BALANCE.deb_minus_cred;
          // } else {
          //   amount = BALANCE.cred_minus_deb;
          // }
        } else {
          amount = default_total;
        }

        //END---calulating Amount
        child.push({
          finance_account_child_id: item["finance_account_child_id"],
          trans_symbol: trans_symbol,
          subtitle: amount,
          title: item.child_name,
          label: item.child_name,
          head_id: item["head_id"],
          disabled: false,
          leafnode: "Y",
          created_status: item["child_created_from"]
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find(val => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        if (!data) {
          //ST---calulating Amount
          const BALANCE = head_data.find(f => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });

          let amount = 0;
          if (BALANCE != undefined) {
            if (trans_symbol == "Dr.") {
              amount = BALANCE.deb_minus_cred;
            } else {
              amount = BALANCE.cred_minus_deb;
            }
          } else {
            amount = default_total;
          }

          //END---calulating Amount

          target.push({
            ...item,
            trans_symbol: trans_symbol,
            subtitle: amount,
            title: item.account_name,
            label: item.account_name,
            disabled: true,
            leafnode: "N"
          });
        }
      } else {
        //ST---calulating Amount
        const BALANCE = head_data.find(f => {
          return item.finance_account_head_id == f.finance_account_head_id;
        });

        let amount = 0;
        if (BALANCE != undefined) {
          if (trans_symbol == "Dr.") {
            amount = BALANCE.deb_minus_cred;
          } else {
            amount = BALANCE.cred_minus_deb;
          }
        } else {
          amount = default_total;
        }

        //END---calulating Amount

        target.push({
          ...item,
          trans_symbol: trans_symbol,
          subtitle: amount,
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
