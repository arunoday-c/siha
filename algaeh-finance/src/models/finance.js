import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import Excel from "exceljs/dist/es5/exceljs.browser";
// import algaehUtilities from "algaeh-utilities/utilities";
import axios from "axios";
export default {
  //created by irfan:
  getAccountHeads_BKP_24_dec: (req, res, next) => {
    //const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 6
    ) {
      const decimal_places = req.userIdentity.decimal_places;

      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (
        input.finance_account_head_id == 1 ||
        input.finance_account_head_id == 5
      ) {
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
              where finance_account_head_id=?              
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
                )select * from cte) group by head_id,child_id; 
                  
              with recursive cte  as (select finance_account_head_id,account_level
                FROM finance_account_head where finance_account_head_id=?
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
                from finance_account_head where finance_account_head_id=?
                union                  
                select H.finance_account_head_id
                from finance_account_head  H inner join cte
                on H.parent_acc_id = cte.finance_account_head_id    
                )select * from cte)
                group by finance_account_head_id order by account_level;   `,

          printQuery: false,

          values: [
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
          ],
        })
        .then((result) => {
          _mysql.releaseConnection();

          const child_data = result[1];

          calcAmount(result[3], result[2], decimal_places)
            .then((head_data) => {
              const outputArray = createHierarchy(
                result[0],
                child_data,
                head_data,
                trans_symbol,
                default_total,
                decimal_places
              );

              req.records = outputArray;
              next();
            })
            .catch((e) => {
              console.error("m4:", e);
              next(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input",
      };
      next();
    }
  },

  //created by irfan:
  getAccountHeads_JAN_9_2020: (req, res, next) => {
    //const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 6
    ) {
      const decimal_places = req.userIdentity.decimal_places;

      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (
        input.finance_account_head_id == 1 ||
        input.finance_account_head_id == 5
      ) {
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
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'
          where (H.root_id=? or H.finance_account_head_id=?) 
          group by C.finance_account_child_id;
          select max(account_level) as account_level from finance_account_head 
          where (root_id=? or finance_account_head_id=?);
          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount
          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id and VD.auth_status='A'
          where (H.root_id=? or H.finance_account_head_id=?) 
          group by H.finance_account_head_id  order by account_level;  `,

          values: [
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
          ],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();

          const child_data = result[1];

          calcAmount(result[3], result[2], decimal_places)
            .then((head_data) => {
              const outputArray = createHierarchy(
                result[0],
                child_data,
                head_data,
                trans_symbol,
                default_total,
                decimal_places
              );

              req.records = outputArray;
              next();
            })
            .catch((e) => {
              console.error("m4:", e);
              next(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input",
      };
      next();
    }
  },
  //created by irfan:
  getAccountHeads: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;
    const decimal_places = req.userIdentity.decimal_places;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 6
    ) {
      getAccountHeadsFunc(decimal_places, input.finance_account_head_id, req)
        .then((result) => {
          req.records = [result];
          next();
        })
        .catch((e) => {
          next(e);
        });
    } else if (input.getAll == "Y") {
      getAccountHeadsFunc(decimal_places, 1, req)
        .then((asset) => {
          getAccountHeadsFunc(decimal_places, 2, req)
            .then((liability) => {
              getAccountHeadsFunc(decimal_places, 3, req)
                .then((capital) => {
                  getAccountHeadsFunc(decimal_places, 4, req)
                    .then((income) => {
                      getAccountHeadsFunc(decimal_places, 5, req)
                        .then((expense) => {
                          req.records = [
                            asset,
                            liability,
                            capital,
                            income,
                            expense,
                          ];
                          next();
                        })
                        .catch((e) => {
                          next(e);
                        });
                    })
                    .catch((e) => {
                      next(e);
                    });
                })
                .catch((e) => {
                  next(e);
                });
            })
            .catch((e) => {
              next(e);
            });
        })
        .catch((e) => {
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input",
      };
      next();
    }
  },
  //created by irfan: before removing child maping
  addAccountHeads_BKP_24_dec: (req, res, next) => {
    const _mysql = new algaehMysql();
    //. const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQueryWithTransaction({
          query: "INSERT INTO `finance_account_child` (child_name)  VALUE(?)",
          values: [input.account_name],
          printQuery: false,
        })
        .then((result) => {
          if (result.insertId > 0) {
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `finance_head_m_child` (head_id,child_id,created_from)  VALUE(?,?,?);",
                values: [input.finance_account_head_id, result.insertId, "U"],
                printQuery: false,
              })
              .then((detail) => {
                if (input.opening_bal > 0) {
                  let debit_amount = 0;
                  let credit_amount = input.opening_bal;
                  let payment_type = "CR";

                  if (
                    input.chart_of_account == 1 ||
                    input.chart_of_account == 5
                  ) {
                    payment_type = "DR";
                    credit_amount = 0;
                    debit_amount = input.opening_bal;
                  }
                  _mysql
                    .executeQuery({
                      query:
                        "insert into finance_voucher_details ( payment_date,head_account_code,head_id,child_id,debit_amount,\
                        payment_type,credit_amount,narration,entered_by,entered_date)  VALUE(?,?,?,?,?,?,?,?,?,?);",
                      values: [
                        new Date(),
                        input.account_code,
                        input.finance_account_head_id,
                        result.insertId,
                        debit_amount,
                        payment_type,
                        credit_amount,
                        "Opening Balance Added from Accounts",
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                      ],
                      printQuery: false,
                    })
                    .then((subdetail) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = {
                          head_id: input.finance_account_head_id,
                          child_id: result.insertId,
                        };
                        next();
                      });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      head_id: input.finance_account_head_id,
                      child_id: result.insertId,
                    };
                    next();
                  });
                }
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            req.records = {
              invalid_input: true,
              message: "Please provide valid input",
            };

            _mysql.rollBackTransaction(() => {
              next();
            });
          }
        })
        .catch((e) => {
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
        select coalesce(max(sort_order),0)as sort_order FROM finance_account_head where parent_acc_id=?;\
        select case  group_type when 'P' then finance_account_head_id else root_id end as root_id from\
        finance_account_head where finance_account_head_id=?;",
          values: [
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
          ],
          printQuery: false,
        })
        .then((result) => {
          const data = result[0][0];
          const sort_order = parseInt(result[1][0]["sort_order"]) + 1;

          let account_code = 0;
          let root_id = result[2][0]["root_id"];

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
                group_type,account_level,created_from,sort_order,parent_acc_id,hierarchy_path,root_id)\
                VALUE(?,?,?,?,?,?,?,?,?,?)",
              values: [
                account_code,
                input.account_name,
                account_parent,
                group_type,
                account_level,
                created_from,
                sort_order,
                parent_acc_id,
                hierarchy_path,
                root_id,
              ],
              printQuery: false,
            })
            .then((resul) => {
              _mysql.releaseConnection();
              req.records = {
                account_code: account_code,
                finance_account_head_id: resul.insertId,
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
    }
  },

  //created by irfan: to
  addAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    //. const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQuery({
          query:
            "select root_id from finance_account_head where finance_account_head_id=?; ",
          values: [input.finance_account_head_id],
        })
        .then((result) => {
          const root_id = result[0]["root_id"];
          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO `finance_account_child` (child_name, arabic_child_name, ledger_code,head_id,created_from\
            ,created_date, created_by, updated_date, updated_by)  VALUE(?,?,?,?,?,?,?,?,?)",
              values: [
                input.account_name,
                input.arabic_account_name,
                input.ledger_code,
                input.finance_account_head_id,
                "U",
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
              ],
              printQuery: false,
            })
            .then((result) => {
              if (result.insertId > 0) {
                if (input.opening_bal > 0) {
                  let debit_amount = 0;
                  let credit_amount = input.opening_bal;
                  let payment_type = "CR";

                  if (root_id == 1 || root_id == 5) {
                    payment_type = "DR";
                    credit_amount = 0;
                    debit_amount = input.opening_bal;
                  }

                  const month = moment().format("M");
                  const year = moment().format("YYYY");

                  _mysql
                    .executeQuery({
                      query:
                        "insert into finance_voucher_details ( payment_date,month,year,head_id,child_id,debit_amount,\
                        payment_type,credit_amount,entered_by,entered_date,auth_status,is_opening_bal)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?);",
                      values: [
                        new Date(),
                        month,
                        year,
                        input.finance_account_head_id,
                        result.insertId,
                        debit_amount,
                        payment_type,
                        credit_amount,
                        req.userIdentity.algaeh_d_app_user_id,
                        input.obDate ? input.obDate : new Date(),
                        "A",
                        "Y",
                      ],
                      printQuery: false,
                    })
                    .then((subdetail) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = {
                          head_id: input.finance_account_head_id,
                          child_id: result.insertId,
                        };
                        next();
                      });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      head_id: input.finance_account_head_id,
                      child_id: result.insertId,
                    };
                    next();
                  });
                }
              } else {
                req.records = {
                  invalid_input: true,
                  message: "Please provide valid input",
                };
                _mysql.rollBackTransaction(() => {
                  next();
                });
              }
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        });
    } else {
      // OLD QUERY // = SUBSTRING_INDEX(max(account_code), '.', -1)+1
      // NEW QUERY // = max(convert((SUBSTRING_INDEX(account_code, '.', -1)), UNSIGNED))+1
      _mysql
        .executeQuery({
          query:
            "select finance_account_head_id,account_code,account_name,\
        account_level,hierarchy_path, concat(account_code,'.',(\
        select max(convert((SUBSTRING_INDEX(account_code, '.', -1)), UNSIGNED))+1\
        FROM finance_account_head where parent_acc_id=?)) as new_code\
        FROM finance_account_head where finance_account_head_id=?;\
        select coalesce(max(sort_order),0)as sort_order FROM finance_account_head where parent_acc_id=?;\
        select case  group_type when 'P' then finance_account_head_id else root_id end as root_id from\
        finance_account_head where finance_account_head_id=?;",
          values: [
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
          ],
          printQuery: false,
        })
        .then((result) => {
          const data = result[0][0];
          const sort_order = parseInt(result[1][0]["sort_order"]) + 1;

          let account_code = 0;

          let root_id = result[2][0]["root_id"];

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
                "INSERT INTO `finance_account_head` (account_code,group_code,account_name, arabic_account_name, account_parent,\
                   group_type,account_level,created_from,sort_order,parent_acc_id,hierarchy_path,root_id, account_type, \
                   created_date, created_by, updated_date, updated_by)\
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                account_code,
                input.ledger_code,
                input.account_name,
                input.arabic_account_name,
                account_parent,
                group_type,
                account_level,
                created_from,
                sort_order,
                parent_acc_id,
                hierarchy_path,
                root_id,
                input.account_type,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
              ],
              printQuery: false,
            })
            .then((resul) => {
              _mysql.releaseConnection();
              req.records = {
                account_code: account_code,
                finance_account_head_id: resul.insertId,
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
    }
  },
  //created by irfan: to
  updateFinanceAccountsMaping: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;
    let strQry = "";

    input.forEach((outerItem) => {
      for (let i = 0; i < outerItem.details?.length; i++) {
        const item = outerItem.details[i];
        strQry += `update finance_accounts_maping set child_id=${item.child_id},head_id=${item.head_id}
        where account='${item.account}';`;
      }
    });
    if (strQry != "") {
      _mysql
        .executeQuery({
          query: strQry,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please Provide valid input",
      };
      next();
    }
  },
  //created by irfan: to
  getFinanceAccountMapingSingle: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();

    const input = req.query;
    let str = "";

    if (input.accounts != undefined && input.accounts.length > 0) {
      str = ` where account in ('${input.accounts}')`;
    }

    _mysql
      .executeQuery({
        query: `select account,M.description,M.mapping_group,M.mapping_group_id,H.root_id,child_id,M.head_id,H.account_name,C.child_name, C.arabic_child_name from \
          finance_accounts_maping M left join finance_account_head H\
          on M.head_id=H.finance_account_head_id left join finance_account_child C \
          on M.child_id=C.finance_account_child_id  ${str};`,

        printQuery: false,
      })
      .then((result) => {
        _mysql.releaseConnection();
        // const arrangedData = _.chain(result)
        //   .groupBy((g) => g.mapping_group_id)
        //   .map((details, key) => {
        //     const { mapping_group, mapping_group_id } = _.head(details);
        //     return {
        //       mapping_group: mapping_group,
        //       mapping_group_id: mapping_group_id,
        //       details: details,
        //     };
        //   })
        //   .value();

        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  getFinanceAccountsMaping: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();

    const input = req.query;
    let str = "";

    if (input.accounts != undefined && input.accounts.length > 0) {
      str = ` where account in ('${input.accounts}')`;
    }

    _mysql
      .executeQuery({
        query: `select account,M.description,M.mapping_group,M.mapping_group_id,H.root_id,child_id,M.head_id,H.account_name,C.child_name, C.arabic_child_name from \
          finance_accounts_maping M left join finance_account_head H\
          on M.head_id=H.finance_account_head_id left join finance_account_child C \
          on M.child_id=C.finance_account_child_id  ${str};`,

        printQuery: false,
      })
      .then((result) => {
        _mysql.releaseConnection();
        const arrangedData = _.chain(result)
          .groupBy((g) => g.mapping_group_id)
          .map((details, key) => {
            const { mapping_group, mapping_group_id } = _.head(details);
            return {
              mapping_group: mapping_group,
              mapping_group_id: mapping_group_id,
              details: details,
            };
          })
          .value();

        req.records = arrangedData;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  getDayEndData: (req, res, next) => {
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;
    let input = req.query;

    let strQry = "";
    let joinStr = "";

    if (input.posted == "Y") {
      strQry += " posted='Y' ";
    } else {
      strQry += " posted='N' ";
    }

    if (input.module_id > 0) {
      strQry += ` and  S.module_id=${input.module_id}`;
    }

    if (input.screen_code !== undefined && input.screen_code != null) {
      strQry += ` and H.from_screen=${input.screen_code}`;
    }

    if (
      moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
      moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
    ) {
      strQry += ` and H.transaction_date between date('${input.from_date}') and  date('${input.to_date}') `;
    }
    if (input.voucherType) {
      strQry += ` and voucher_type = '${input.voucherType}'`;
    }
    if (input.document_number !== undefined && input.document_number != null) {
      strQry += ` and  H.document_number like '%${input.document_number}%' `;
    }

    if (input.child_id > 0) {
      joinStr =
        "  inner join finance_day_end_sub_detail SD on \
       H.finance_day_end_header_id=SD.day_end_header_id ";
      strQry += ` and  SD.child_id=${input.child_id}`;
    }
    // if (
    //   input.transaction_type !== undefined &&
    //   input.transaction_type == null
    // ) {
    //   strQry += ` and H.transaction_type='${input.transaction_type}'`;
    // }

    // `select SD.finance_day_end_sub_detail_id,D.finance_day_end_detail_id ,H.transaction_date,case D.payment_mode when 'CA' then\
    // 'CASH' when 'CH' then 'CHEQUE' when 'CD' then 'CARD'  end as payment_mode ,D.amount,SD.narration,\
    // H.document_type,H.document_number,case H.transaction_type when 'AD' then 'ADVANCE' \
    // when 'RF' then 'REFUND' end as transaction_type ,S.screen_name from finance_day_end_header H inner join\
    // finance_day_end_detail D on H.finance_day_end_header_id=D.day_end_header_id \
    // inner join finance_day_end_sub_detail SD on D.finance_day_end_detail_id=SD.day_end_detail_id\
    // left join  algaeh_d_app_screens S on H.from_screen=S.screen_code\
    // where  SD.posted='N'  ${strQry}  group by finance_day_end_detail_id;`

    // select finance_day_end_header_id,transaction_date,amount,
    // document_number,from_screen,case H.transaction_type when 'AD' then 'ADVANCE'
    // when 'RF' then 'REFUND' when 'BILL' then 'OPBILL' when  'CREDIT' then
    // 'PATIENT CREDIT'  when  'ADJUST' then 'ADVANCE ADJUST'  when 'CREDIT_ST' then 'CREDIT SETTLEMENT'
    // when 'OP_BIL_CAN' then 'OP BILL CANCEL'  when 'JV' then 'JOURNAL VOUCHER'
    // end as transaction_type,S.screen_name
    // from finance_day_end_header H inner join finance_day_end_sub_detail SD on
    //  H.finance_day_end_header_id=SD.day_end_header_id
    // left join  algaeh_d_app_screens S on H.from_screen=S.screen_code  where  SD.posted='N'  ${strQry}
    // group by  finance_day_end_header_id;
    let strQuery = "";
    if (input.revert_trans == "Y") {
      strQuery = `select R.finance_revert_day_end_header_id as finance_day_end_header_id, R.transaction_date,    
          ROUND( R.amount , ${decimal_places}) as amount, R.voucher_type, R.document_number,  
          R.invoice_no, R.from_screen, R.narration, R.entered_date, EMP.full_name as entered_by
          from finance_revert_day_end_header R 
          left join algaeh_d_app_user U on U.algaeh_d_app_user_id = R.entered_by
          left join hims_d_employee EMP on EMP.hims_d_employee_id = U.employee_id order by R.transaction_date desc`;
    } else {
      strQuery = `select finance_day_end_header_id, transaction_date,    
          ROUND( amount , ${decimal_places}) as amount, voucher_type, document_number,  
          invoice_no, screen_name, ref_no as cheque_no,cheque_date, from_screen,
          ROUND( cheque_amount , ${decimal_places}) as  cheque_amount, narration, 
          EMP.full_name as entered_by, entered_date from finance_day_end_header H 
          ${joinStr}
          left join  algaeh_d_app_screens S on H.from_screen=S.screen_code
          left join algaeh_d_app_user U on H.entered_by=U.algaeh_d_app_user_id
          left join hims_d_employee EMP on EMP.hims_d_employee_id = U.employee_id
          where ${strQry}  order by transaction_date desc; `;
    }
    _mysql
      .executeQuery({
        query: strQuery,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: to
  postDayEndData_BKP_27_JAN_202: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;

    _mysql
      .executeQuery({
        query: ` select day_end_header_id from (
          select day_end_header_id,if (sum(debit_amount) =sum(credit_amount) ,'Y','N') as equal 
          from finance_day_end_header H inner join finance_day_end_sub_detail D on
          H.finance_day_end_header_id=D.day_end_header_id and H.posted='N'
          where day_end_header_id in (?)
          group by day_end_header_id) as A where equal='Y';`,
        values: [input.finance_day_end_header_ids],
        printQuery: false,
      })
      .then((result) => {
        if (result.length > 0) {
          let total_income = 0;
          let total_expense = 0;
          let balance = 0;
          const validDayEndHeaderIds = [];
          result.forEach((item) => {
            validDayEndHeaderIds.push(item.day_end_header_id);
          });

          _mysql
            .executeQuery({
              query:
                "select D.finance_day_end_sub_detail_id,D.day_end_header_id,D.payment_date,\
              head_id,child_id,debit_amount,payment_type,credit_amount,year,month,\
              hospital_id,H.root_id,D.project_id,D.sub_department_id\
              from finance_day_end_sub_detail D  \
              left join finance_account_head H  on D.head_id=H.finance_account_head_id\
              where  D.day_end_header_id in (?)",
              values: [validDayEndHeaderIds],
              printQuery: false,
            })
            .then((details) => {
              details.forEach((m) => {
                if (m.root_id == 4) {
                  if (m.payment_type == "CR") {
                    total_income =
                      parseFloat(total_income) + parseFloat(m.credit_amount);
                  } else if (m.payment_type == "DR") {
                    total_income =
                      parseFloat(total_income) - parseFloat(m.debit_amount);
                  }
                } else if (m.root_id == 5) {
                  if (m.payment_type == "DR") {
                    total_expense =
                      parseFloat(total_expense) + parseFloat(m.debit_amount);
                  } else if (m.payment_type == "CR") {
                    total_expense =
                      parseFloat(total_expense) - parseFloat(m.credit_amount);
                  }
                }
              });
              balance = parseFloat(total_income) - parseFloat(total_expense);

              if (balance > 0) {
                details.push({
                  payment_date: new Date(),
                  head_account_code: 3.1,
                  root_id: 3,
                  head_id: 3,
                  child_id: 1,
                  debit_amount: 0,
                  credit_amount: balance,
                  payment_type: "CR",
                  hospital_id: details[0]["hospital_id"],
                  year: moment().format("YYYY"),
                  month: moment().format("M"),
                  voucher_no: null,
                });
              } else if (balance < 0) {
                details.push({
                  payment_date: new Date(),
                  head_account_code: 3.1,
                  root_id: 3,
                  head_id: 3,
                  child_id: 1,
                  debit_amount: Math.abs(balance),
                  credit_amount: 0,
                  payment_type: "DR",
                  hospital_id: details[0]["hospital_id"],
                  year: moment().format("YYYY"),
                  month: moment().format("M"),
                  voucher_no: null,
                });
              }

              _mysql
                .executeQueryWithTransaction({
                  query:
                    "insert into finance_voucher_header (voucher_type,voucher_no,day_end_header_id,amount,\
                        payment_date,narration,from_screen,posted_from,year,month,invoice_no,ref_no,cheque_date,cheque_amount)\
                        select voucher_type,document_number,finance_day_end_header_id,amount,transaction_date,\
                        narration,from_screen,'D',year(transaction_date),month(transaction_date), \
                        invoice_no,ref_no,cheque_date,cheque_amount\
                        from finance_day_end_header where finance_day_end_header_id in(?) ",
                  values: [validDayEndHeaderIds],
                  printQuery: false,
                })
                .then((headRes) => {
                  const insertColumns = [
                    "payment_date",
                    "head_id",
                    "child_id",
                    "debit_amount",
                    "credit_amount",
                    "payment_type",
                    "hospital_id",
                    "year",
                    "month",
                    "project_id",
                    "sub_department_id",
                  ];
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "insert into finance_voucher_details (??) values ?;",
                      values: details,
                      includeValues: insertColumns,
                      bulkInsertOrUpdate: true,
                      extraValues: {
                        voucher_header_id: headRes.insertId,
                        auth_status: "A",
                      },
                      printQuery: false,
                    })
                    .then((result2) => {
                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            " update finance_day_end_header set posted='Y' ,posted_date=CURDATE(),posted_by=? where \
                            finance_day_end_header_id in(?);",
                          values: [
                            req.userIdentity.algaeh_d_app_user_id,
                            validDayEndHeaderIds,
                          ],
                          printQuery: false,
                        })
                        .then((result3) => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = result3;
                            next();
                          });
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                })
                .catch((e) => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "Credit and Debit are not equal",
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  SaveNarration: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;

    _mysql
      .executeQuery({
        query: `UPDATE finance_day_end_header set narration = ? where finance_day_end_header_id = ?;`,
        values: [input.narration, input.finance_day_end_header_id],
        printQuery: false,
      })
      .then((headRes) => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = headRes;
          next();
        });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  //created by irfan: to

  //created by Nowshad: to
  revertDayEnd: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;
    _mysql
      .executeQueryWithTransaction({
        query:
          "select * from finance_day_end_header where finance_day_end_header_id=?; \
                select * from finance_day_end_sub_detail where day_end_header_id=?",
        values: [
          input.finance_day_end_header_id,
          input.finance_day_end_header_id,
        ],
        printQuery: true,
      })
      .then((voucher_result) => {
        const voucher_header = voucher_result[0][0];
        const voucher_detail = voucher_result[1];
        _mysql
          .executeQueryWithTransaction({
            query:
              "INSERT INTO finance_revert_day_end_header (day_end_header_id, transaction_date, amount, voucher_type, document_id,\
              document_number, invoice_no, from_screen, narration, entered_by, entered_date) \
              VALUES (?,?,?,?,?,?,?,?,?,?,?);",
            values: [
              voucher_header.finance_day_end_header_id,
              voucher_header.transaction_date,
              voucher_header.amount,
              voucher_header.voucher_type,
              voucher_header.document_id,
              voucher_header.document_number,
              voucher_header.invoice_no,
              voucher_header.from_screen,
              voucher_header.narration,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
            ],
            printQuery: true,
          })
          .then((header_result) => {
            const IncludeValuess = [
              "payment_date",
              "head_id",
              "child_id",
              "debit_amount",
              "payment_type",
              "credit_amount",
              "hospital_id",
              "project_id",
              "sub_department_id",
              "year",
              "month",
            ];

            _mysql
              .executeQueryWithTransaction({
                query:
                  "INSERT INTO finance_revert_day_end_sub_detail (??) VALUES ? ;",
                values: voucher_detail,
                includeValues: IncludeValuess,
                bulkInsertOrUpdate: true,
                extraValues: {
                  revert_day_end_header_id: header_result.insertId,
                },
                printQuery: true,
              })
              .then((subResult) => {
                let strQuery = `delete from finance_day_end_sub_detail where day_end_header_id=${input.finance_day_end_header_id};
                  delete from finance_day_end_header where finance_day_end_header_id=${input.finance_day_end_header_id};`;

                if (input.from_screen == "PR0004") {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "select hims_f_procurement_grn_header_id, po_id from hims_f_procurement_grn_header where grn_number=?;",
                      values: [input.document_number],
                      printQuery: true,
                    })
                    .then((receipt_result) => {
                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            `UPDATE hims_f_procurement_po_header SET is_posted='N', authorize1='N', authorize2='N',\
                    is_revert='Y', revert_reason=?, reverted_date=?, reverted_by=? WHERE hims_f_procurement_po_header_id=?; \
                    UPDATE hims_f_procurement_grn_header SET posted='N', is_revert='Y', reverted_date=?, reverted_by=? \
                    WHERE hims_f_procurement_grn_header_id=?;` + strQuery,
                          values: [
                            input.revert_reason,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            receipt_result[0].po_id,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            receipt_result[0].hims_f_procurement_grn_header_id,
                          ],
                          printQuery: true,
                        })
                        .then((result) => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = result;
                            next();
                          });
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                  // strQuery += `update hims_f_procurement_grn_header set posted='N' where grn_number='${input.document_number}';`;
                } else if (input.from_screen == "PR0006") {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        `UPDATE hims_f_procurement_po_return_header SET is_posted='N', is_revert='Y', \
                        revert_reason=?, reverted_date=?, reverted_by=? WHERE purchase_return_number=?;` +
                        strQuery,
                      values: [
                        input.revert_reason,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        input.document_number,
                      ],
                      printQuery: true,
                    })
                    .then((result) => {
                      // consol.log("document_id", input.document_id);
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = result;
                        next();
                      });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });

                  // strQuery += `update hims_f_procurement_grn_header set posted='N' where grn_number='${input.document_number}';`;
                } else if (input.from_screen == "SAL005") {
                  // strQuery += `update hims_f_sales_invoice_header set is_posted='N' where invoice_number='${input.document_number}';`;

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "select hims_f_sales_invoice_header_id, sales_invoice_mode, sales_order_id from hims_f_sales_invoice_header where invoice_number=?;",
                      values: [input.document_number],
                      printQuery: true,
                    })
                    .then((invoie_result) => {
                      const firstItem = _.head(invoie_result);
                      if (firstItem) {
                        req.hims_f_sales_order_id = firstItem.sales_order_id;
                      }
                      let strQry = "";

                      if (invoie_result[0].sales_invoice_mode === "S") {
                        strQry = _mysql.mysqlQueryFormat(
                          " select * from hims_f_sales_order_services where sales_order_id=?;",
                          [invoie_result[0].sales_order_id]
                        );
                      } else if (invoie_result[0].sales_invoice_mode === "I") {
                        strQry = _mysql.mysqlQueryFormat(
                          " select * from hims_f_sales_order_items where sales_order_id=?;",
                          [invoie_result[0].sales_order_id]
                        );
                      }

                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "UPDATE hims_f_sales_order SET is_posted='N', authorize1='N', authorize2='N',\
                    is_revert='Y', revert_reason=?, reverted_date=?, reverted_by=? WHERE hims_f_sales_order_id=?; \
                    UPDATE hims_f_sales_invoice_header SET is_posted='N', is_revert='Y', reverted_date=?, reverted_by=? \
                    WHERE hims_f_sales_invoice_header_id=?;" +
                            strQry,
                          values: [
                            input.revert_reason,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            invoie_result[0].sales_order_id,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            invoie_result[0].hims_f_sales_invoice_header_id,
                          ],
                          printQuery: true,
                        })
                        .then((result) => {
                          const sales_order_services = result[2];
                          let IncludeValues = [];
                          if (invoie_result[0].sales_invoice_mode === "S") {
                            IncludeValues = [
                              "sales_order_id",
                              "services_id",
                              "service_frequency",
                              "unit_cost",
                              "quantity",
                              "extended_cost",
                              "discount_percentage",
                              "discount_amount",
                              "net_extended_cost",
                              "tax_percentage",
                              "tax_amount",
                              "total_amount",
                              "comments",
                              "arabic_comments",
                            ];

                            _mysql
                              .executeQuery({
                                query:
                                  `INSERT INTO hims_f_sales_order_adj_services(??) VALUES ?;` +
                                  strQuery,
                                values: sales_order_services,
                                includeValues: IncludeValues,
                                extraValues: {
                                  created_by:
                                    req.userIdentity.algaeh_d_app_user_id,
                                  created_date: new Date(),
                                },
                                bulkInsertOrUpdate: true,
                                printQuery: true,
                              })
                              .then((detailResult) => {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  req.records = detailResult;
                                  next();
                                });
                              })
                              .catch((error) => {
                                _mysql.rollBackTransaction(() => {
                                  next(error);
                                });
                              });
                          } else if (
                            invoie_result[0].sales_invoice_mode === "I"
                          ) {
                            IncludeValues = [
                              "sales_order_id",
                              "item_id",
                              "uom_id",
                              "unit_cost",
                              "quantity",
                              "extended_cost",
                              "discount_percentage",
                              "discount_amount",
                              "net_extended_cost",
                              "tax_percentage",
                              "tax_amount",
                              "total_amount",
                              "quantity_outstanding",
                            ];

                            _mysql
                              .executeQuery({
                                query:
                                  `INSERT INTO hims_f_sales_order_adj_item(??) VALUES ?;` +
                                  strQuery,
                                values: sales_order_services,
                                includeValues: IncludeValues,
                                extraValues: {
                                  created_by:
                                    req.userIdentity.algaeh_d_app_user_id,
                                  created_date: new Date(),
                                },
                                bulkInsertOrUpdate: true,
                                printQuery: true,
                              })
                              .then((detailResult) => {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  req.records = detailResult;
                                  next();
                                });
                              })
                              .catch((error) => {
                                _mysql.rollBackTransaction(() => {
                                  next(error);
                                });
                              });
                          } else {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              req.records = detailResult;
                              next();
                            });
                          }
                        })

                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                }
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },
  //created by irfan: to
  removeAccountHead: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQuery({
          query: `select created_from from finance_account_child where \
                head_id=? and finance_account_child_id=?;\
                select finance_voucher_id from finance_voucher_details where head_id=? and child_id=? limit 1;`,
          values: [
            input.head_id,
            input.child_id,
            input.head_id,
            input.child_id,
          ],
          printQuery: false,
        })
        .then((result) => {
          if (result[0][0]["created_from"] == "S") {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cant Delete System Generated Account ",
            };
            next();
          } else {
            if (result[1].length > 0) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Transactions Found Cant Delete this Account ",
              };
              next();
            } else {
              _mysql
                .executeQueryWithTransaction({
                  query: ` delete from finance_account_child where finance_account_child_id=?;`,
                  values: [input.child_id],
                  printQuery: false,
                })
                .then((resu) => {
                  // _mysql.releaseConnection();
                  // req.records = resu;
                  // next();

                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = resu;
                    next();
                  });
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else if (input.leaf_node == "N") {
      _mysql
        .executeQuery({
          query: `SELECT finance_account_head_id, created_from FROM finance_account_head\
                   where finance_account_head_id=?;\

                   with recursive cte  as (          
                    select  finance_account_head_id
                    from finance_account_head where finance_account_head_id=?
                    union                  
                    select H.finance_account_head_id
                    from finance_account_head  H inner join cte
                    on H.parent_acc_id = cte.finance_account_head_id    
                    )select * from cte;`,
          values: [input.head_id, input.head_id],
          printQuery: false,
        })
        .then((result) => {
          if (result[0][0]["created_from"] == "S") {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cant Delete System Generated Account Heads",
            };
            next();
          } else {
            const head_ids = result[1].map((m) => m.finance_account_head_id);
            _mysql
              .executeQuery({
                query: `select finance_voucher_id from finance_voucher_details where head_id in  (?)`,
                values: [head_ids],
                printQuery: false,
              })
              .then((resul) => {
                if (resul.length > 0) {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: "Transactions Found ,Cant Delete this Account ",
                  };
                  next();
                } else {
                  _mysql
                    .executeQueryWithTransaction({
                      query: `delete from finance_account_child where head_id in (?);                    
                        delete from finance_account_head  where finance_account_head_id in (?);`,
                      values: [head_ids, head_ids],
                      printQuery: false,
                    })
                    .then((deleteRes) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = deleteRes;
                        next();
                      });
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },

  //created by irfan: to
  previewDayEndEntries: (req, res, next) => {
    const _mysql = new algaehMysql();

    let strQuery = "";

    const decimal_places = req.userIdentity.decimal_places;

    if (req.query.revert_trans == "Y") {
      strQuery = `select finance_revert_day_end_sub_detail_id ,payment_date,SD.head_id,
      child_id,concat(account_name,'-->',child_name ) as to_account,  ROUND( debit_amount , ${decimal_places}) as debit_amount,
      case payment_type when 'CR' then 'Credit' else 'Debit' end
       as payment_type, ROUND( credit_amount , ${decimal_places}) as credit_amount, reverted
      from finance_revert_day_end_sub_detail SD left join finance_account_head H on SD.head_id=H.finance_account_head_id
      left join finance_account_child C on SD.child_id=C.finance_account_child_id where revert_day_end_header_id=? order by payment_type desc;`;
    } else {
      strQuery = `select finance_day_end_sub_detail_id ,payment_date,SD.head_id,
      child_id,concat(account_name,'-->',child_name ) as to_account,  ROUND( debit_amount , ${decimal_places}) as debit_amount,
      case payment_type when 'CR' then 'Credit' else 'Debit' end
       as payment_type, ROUND( credit_amount , ${decimal_places}) as credit_amount, reverted
      from finance_day_end_sub_detail SD left join finance_account_head H on SD.head_id=H.finance_account_head_id
      left join finance_account_child C on SD.child_id=C.finance_account_child_id where day_end_header_id=? order by payment_type desc;`;
    }

    _mysql
      .executeQuery({
        query: strQuery,
        values: [req.query.day_end_header_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        req.records = {
          entries: _.orderBy(result, ["payment_type"], ["desc"]),
        };
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getAccountHeadsForDropdown: (req, res, next) => {
    //  const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 6
    ) {
      let str = "";

      if (input.finance_account_head_id == 3) {
        str = " and  finance_account_child_id <> 1";
      }

      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code,account_name,account_parent,account_level,
          H.created_from as created_status ,sort_order,parent_acc_id,root_id,
          finance_account_child_id,if (ledger_code is null,child_name, concat(child_name,' (',ledger_code,')'))as child_name,
          head_id,C.created_from as child_created_from
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id  ${str}
           where (root_id=? or finance_account_head_id=?) order by account_level,sort_order;     `,

          printQuery: false,

          values: [
            input.finance_account_head_id,
            input.finance_account_head_id,
          ],
        })
        .then((result) => {
          _mysql.releaseConnection();
          const outputArray = createHierarchyForDropdown(result);
          req.records = outputArray;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      _mysql
        .executeQuery({
          query: `select * from finance_options`,

          printQuery: true,
          values: [],
        })
        .then((result) => {
          let selectStr = "";
          let whereStr = "";
          let unionStr = "";

          switch (input.voucher_type) {
            case "journal":
              if (result[0].show_bank_cash === "Y") {
                selectStr = " ,parent_acc_id ";
                whereStr = " where 1+1";
                unionStr = "where 1+1";
              } else {
                selectStr = " ,parent_acc_id ";
                whereStr = ` where account_type  not in ('B','C') `;
                unionStr = ` where account_type  not in ('B','C') `;
              }
              break;

            case "contra":
              selectStr = ` ,  case  account_type  when 'B' then null when 'C' then null else parent_acc_id end as parent_acc_id `;
              whereStr = ` where account_type  in ('B','C') `;
              break;

            case "sales":
              selectStr = " ,parent_acc_id ";
              // whereStr = ` where account_type  not in ('B','C') `;
              // unionStr = ` where account_type  not in ('B','C') `;
              break;

            case "CIH":
              selectStr = ` ,  case  account_type   when 'C' then null else parent_acc_id end as parent_acc_id `;
              whereStr = ` where account_type  ='C' `;
              break;

            default:
              selectStr = " ,parent_acc_id ";
          }

          // query: `	select finance_account_head_id,H.account_code,account_name,parent_acc_id,
          // C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
          // ,account_level,H.sort_order,CM.head_id,H.created_from as created_status,H.root_id
          // FROM finance_account_head H left join
          // finance_head_m_child CM on H.finance_account_head_id=CM.head_id
          // left join finance_account_child C on CM.child_id=C.finance_account_child_id ${strQry};`,

          _mysql
            .executeQuery({
              // query: `select finance_account_head_id,account_code,account_name,account_parent,account_level,
              // H.created_from as created_status ,sort_order,parent_acc_id,root_id,
              // finance_account_child_id,child_name,head_id,C.created_from as child_created_from
              // from finance_account_head H left join
              // finance_account_child C on C.head_id=H.finance_account_head_id
              // ${strQry} order by account_level,sort_order;     `,

              query: ` with recursive cte as (
              select finance_account_head_id,account_code,account_name,account_parent,account_level,
              H.created_from as created_status ,sort_order ,C.arabic_child_name ${selectStr}
              ,root_id,
              finance_account_child_id,if (ledger_code is null,child_name, 
                concat(child_name,' (',ledger_code,')'))as child_name,head_id,C.created_from as child_created_from
              from finance_account_head H left join
              finance_account_child C on C.head_id=H.finance_account_head_id and  finance_account_child_id <> 1 ${whereStr}
             
              union                  
              select H.finance_account_head_id,H.account_code,H.account_name,H.account_parent,H.account_level,
              H.created_from as created_status ,H.sort_order,C.arabic_child_name,H.parent_acc_id,H.root_id,
              C.finance_account_child_id,
              if (C.ledger_code is null,C.child_name, concat(C.child_name,' (',C.ledger_code,')'))as child_name,
              C.head_id,C.created_from as child_created_from            from finance_account_head H left join
              finance_account_child C on C.head_id=H.finance_account_head_id
              inner join cte on H.parent_acc_id = cte.finance_account_head_id   ${unionStr}
              )
              select * from cte order by account_level,sort_order;`,

              printQuery: true,
              values: [],
            })
            .then((result) => {
              _mysql.releaseConnection();
              const outputArray = createHierarchyForDropdown(result);
              req.records = outputArray;

              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });

          // next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },

  //created by irfan:
  getLedgerDataForChart: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 6 &&
      input.period > 0 &&
      input.period < 6
    ) {
      const monthArray = [];
      let year = "";

      if (input.year > 0) {
        year = input.year;
      } else {
        year = moment().format("YYYY");
      }

      switch (input.period.toString()) {
        case "1":
          monthArray.push(1, 2, 3);
          break;
        case "2":
          monthArray.push(4, 5, 6);
          break;
        case "3":
          monthArray.push(8, 8, 9);
          break;
        case "4":
          monthArray.push(10, 11, 12);
          break;
        default:
          monthArray.push(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
      }
      _mysql
        .executeQuery({
          query: `with cte as(
            select head_id,month,monthname(concat('1999-',month,'-01')) as month_name,
            coalesce(sum(debit_amount)-sum(credit_amount),0)as debit_minus_credit,
            coalesce(sum(credit_amount)-sum(debit_amount),0)as credit_minus_debit from 
            finance_voucher_details where  year=? and month in(?) and head_id in (with recursive heads  as (          
            select  finance_account_head_id
            from finance_account_head where finance_account_head_id=?
            union                  
            select H.finance_account_head_id
            from finance_account_head  H inner join heads
            on H.parent_acc_id = heads.finance_account_head_id    
            )select  finance_account_head_id from heads) group by month
            ) select t.*,(100 * (t.debit_minus_credit - t2.debit_minus_credit) / t2.debit_minus_credit) as dr_growth_percent,
            (100 * (t.credit_minus_debit - t2.credit_minus_debit) / t2.credit_minus_debit) as cr_growth_percent
             from cte as t left join cte t2 on  t2.month=(t.month-1);  `,

          printQuery: false,
          values: [year, monthArray, input.finance_account_head_id],
        })
        .then((result) => {
          _mysql.releaseConnection();
          let outputArray = [];
          if (
            input.finance_account_head_id == 1 ||
            input.finance_account_head_id == 5
          ) {
            outputArray = result.map((m) => {
              return {
                ...m,
                amount: m.debit_minus_credit,
                growth_percent: m.dr_growth_percent,
              };
            });
          } else {
            outputArray = result.map((m) => {
              return {
                ...m,
                amount: m.credit_minus_debit,
                growth_percent: m.cr_growth_percent,
              };
            });
          }

          req.records = outputArray;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input",
      };
      next();
    }
  },

  //created by irfan: to
  renameAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQuery({
          query:
            "select finance_account_child_id,C.created_from,H.root_id,C.head_id from finance_account_child C inner join finance_account_head H \
            on C.head_id=H.finance_account_head_id where finance_account_child_id=?;\
            select finance_voucher_id,debit_amount,credit_amount,payment_type,head_id,H.root_id,payment_date \
            from finance_voucher_details VD inner join finance_account_head H\
            on VD.head_id=H.finance_account_head_id  where VD.auth_status='A'\
            and VD.is_opening_bal='Y' and VD.child_id=?;\
            select default_branch_id FROM finance_options limit 1;",
          values: [
            input.finance_account_child_id,
            input.finance_account_child_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          let voucherStr = "";

          //if update if opening balance exist
          if (input.enableOP == true) {
            if (result[1].length > 0) {
              const data = result[1][0];

              if (data.root_id == 1 || data.root_id == 5) {
                if (parseFloat(input.opening_balance) >= 0) {
                  voucherStr = `update finance_voucher_details set ${
                    input.type === "CR" ? "credit_amount" : "debit_amount"
                  }=${input.opening_balance},
                payment_type ='${input.type.toUpperCase()}',${
                    input.type === "CR" ? "debit_amount" : "credit_amount"
                  }=0, payment_date='${
                    input.obDate ? input.obDate : moment().format("YYYY-MM-DD")
                  }', updated_by='${
                    req.userIdentity.algaeh_d_app_user_id
                  }', updated_date='${moment(new Date()).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}'  
                  where finance_voucher_id=${data.finance_voucher_id};`;
                }
              } else if (
                data.root_id == 2 ||
                data.root_id == 3 ||
                data.root_id == 4
              ) {
                if (parseFloat(input.opening_balance) >= 0) {
                  voucherStr = `update finance_voucher_details set ${
                    input.type === "DR" ? "debit_amount" : "credit_amount"
                  }=${input.opening_balance},
                payment_type ='${input.type.toUpperCase()}',${
                    input.type === "DR" ? "credit_amount" : "debit_amount"
                  }=0, payment_date='${
                    input.obDate ? input.obDate : moment().format("YYYY-MM-DD")
                  }', updated_by='${
                    req.userIdentity.algaeh_d_app_user_id
                  }', updated_date='${moment(new Date()).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}' 
                  where finance_voucher_id=${data.finance_voucher_id};`;
                }
              }

              executeFunction();
            }
            //inserting new opening balance
            else {
              const voucher_type = input.assetCode === 2 ? "purchase" : "sales";
              const { algaeh_d_app_user_id } = req.userIdentity;
              _mysql
                .generateRunningNumber({
                  user_id: algaeh_d_app_user_id,
                  numgen_codes: [voucher_type.toUpperCase()],
                  table_name: "finance_numgen",
                })
                .then((numgen) => {
                  const month = moment().format("MM");
                  const year = moment().format("YYYY");
                  const oblStringNumber =
                    "OBL" +
                    numgen[voucher_type.toUpperCase()].replace(/[^\d.-]/g, "");
                  let queryGen = { query: "select 1;" };
                  if (input.insertInVoucherHeader === true) {
                    queryGen = {
                      query: ` insert into finance_voucher_header(voucher_type,voucher_no,amount,payment_date,
                        month,year,narration,from_screen,posted_from,created_by,updated_by,invoice_no)
                value(?,?,?,?,?,?,'Opening Balance Added from Accounts','ACCOUNTS OPENING BALANCE','V',?,?,?)`,
                      values: [
                        voucher_type,
                        numgen[voucher_type.toUpperCase()],
                        input.opening_balance,
                        input.obDate ? input.obDate : new Date(),
                        month,
                        year,
                        algaeh_d_app_user_id,
                        algaeh_d_app_user_id,
                        oblStringNumber,
                      ],
                      printQuery: true,
                    };
                  }
                  _mysql
                    .executeQuery(queryGen)
                    .then((headerResult) => {
                      const { insertId } = headerResult;

                      //Added existing statements
                      let insert_data = result[0][0];

                      let debit_amount = 0;
                      let credit_amount = 0;
                      let payment_type = "CR";
                      if (
                        (insert_data["root_id"] == 1 ||
                          insert_data["root_id"] == 5) &&
                        input.opening_balance > 0
                      ) {
                        debit_amount = input.opening_balance;
                        payment_type = "DR";

                        switch (input.type) {
                          case "CR":
                            debit_amount = 0;
                            credit_amount = input.opening_balance;
                            payment_type = "CR";
                            break;
                        }

                        voucherStr = _mysql.mysqlQueryFormat(
                          "INSERT INTO finance_voucher_details (voucher_header_id,payment_date,head_id,child_id,debit_amount,credit_amount,\
                        payment_type,hospital_id,year,month,is_opening_bal,narration,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [
                            insertId,
                            input.obDate ? input.obDate : new Date(),
                            insert_data.head_id,
                            insert_data.finance_account_child_id,
                            debit_amount,
                            credit_amount,
                            payment_type,
                            result[2][0]["default_branch_id"],
                            moment().format("YYYYY"),
                            moment().format("M"),
                            "Y",
                            "Opening Balance Added from Accounts",
                            algaeh_d_app_user_id,
                            "A",
                          ]
                        );
                      } else if (
                        (insert_data["root_id"] == 2 ||
                          insert_data["root_id"] == 3 ||
                          insert_data["root_id"] == 4) &&
                        input.opening_balance > 0
                      ) {
                        credit_amount = input.opening_balance;
                        switch (input.type) {
                          case "DR":
                            credit_amount = 0;
                            debit_amount = input.opening_balance;
                            payment_type = "DR";
                            break;
                        }
                        voucherStr = _mysql.mysqlQueryFormat(
                          "INSERT INTO finance_voucher_details (voucher_header_id,payment_date,head_id,child_id,debit_amount,credit_amount,\
                      payment_type,hospital_id,year,month,is_opening_bal,narration,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [
                            insertId,
                            input.obDate ? input.obDate : new Date(),
                            insert_data.head_id,
                            insert_data.finance_account_child_id,
                            debit_amount,
                            credit_amount,
                            payment_type,
                            result[2][0]["default_branch_id"],
                            moment().format("YYYYY"),
                            moment().format("M"),
                            "Y",
                            "Opening Balance Added from Accounts",
                            algaeh_d_app_user_id,
                            "A",
                          ]
                        );
                      }
                      executeFunction((rest) => {
                        _mysql.commitTransaction((error) => {
                          if (error) {
                            _mysql.rollBackTransaction();
                            next(error);
                          } else {
                            req.records = rest;
                            next();
                          }
                        });
                      });
                      //End of existing statements
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction((error) => {
                        next(error);
                      });
                    });
                })
                .catch((error) => {
                  _mysql.rollBackTransaction((error) => {
                    next(error);
                  });
                });
            }
          } else {
            executeFunction();
          }

          function executeFunction(callBack) {
            // if (result[0][0]["created_from"] == "U") {

            _mysql
              .executeQuery({
                query: `update finance_account_child set  child_name=?,arabic_child_name=?,updated_by=?,updated_date=?,ledger_code=? where\
                  finance_account_child_id=? ; ${voucherStr};`,
                values: [
                  input.child_name,
                  input.arabic_child_name
                    ? input.arabic_child_name
                    : input.arabic_account_name,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  input.ledgerCode,
                  input.finance_account_child_id,
                ],
                printQuery: true,
              })
              .then((result2) => {
                if (typeof callBack === "function") {
                  callBack(result2);
                } else {
                  _mysql.releaseConnection();
                  req.records = result2;
                  next();
                }
              })
              .catch((e) => {
                if (typeof callBack === "function") {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                } else {
                  _mysql.releaseConnection();
                  next(e);
                }
              });
            // } else if (
            //   result[0][0]["created_from"] == "S" &&
            //   voucherStr != ""
            // ) {
            //   _mysql
            //     .executeQuery({
            //       query: voucherStr,
            //       printQuery: true,
            //     })
            //     .then((result2) => {
            //       if (typeof callBack === "function") {
            //         callBack(result2);
            //       } else {
            //         _mysql.releaseConnection();
            //         req.records = result2;
            //         next();
            //       }
            //     })
            //     .catch((e) => {
            //       if (typeof callBack === "function") {
            //         _mysql.rollBackTransaction(() => {
            //           next(e);
            //         });
            //       } else {
            //         _mysql.releaseConnection();
            //         next(e);
            //       }
            //     });
            // } else {
            //   if (typeof callBack === "function") {
            //     callBack({
            //       invalid_input: true,
            //       message: "Cannot Modify System defined Ledgers",
            //     });
            //   } else {
            //     _mysql.releaseConnection();
            //     req.records = {
            //       invalid_input: true,
            //       message: "Cannot Modify System defined Ledgers",
            //     };
            //     next();
            //   }
            // }
          }
        })
        .catch((e) => {
          if (typeof callBack === "function") {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          } else {
            _mysql.releaseConnection();
            next(e);
          }
        });
    } else {
      _mysql
        .executeQuery({
          query:
            "select created_from from finance_account_head where finance_account_head_id=?;",
          values: [input.finance_account_head_id],
          printQuery: false,
        })
        .then((result) => {
          const record = _.head(result);
          if (!record) {
            _mysql.releaseConnection();
            next(new Error("There is no such account exists"));
            return;
          }
          //As per requirement by mujahid on 17-02-2021
          // if (result[0]["created_from"] == "U") {
          _mysql
            .executeQuery({
              query:
                "update finance_account_head set account_name=?,account_type=?, updated_by=?,updated_date=?,arabic_account_name=?,group_code=? \
                 where finance_account_head_id=? ;", //and created_from='U'
              values: [
                input.account_name,
                input.account_type,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                input.arabic_account_name,
                input.ledgerCode,
                input.finance_account_head_id,
              ],
              printQuery: false,
            })
            .then((result2) => {
              _mysql.releaseConnection();
              req.records = result2;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
          //As per requirement by mujahid on 17-02-2021
          //   } else {
          //   _mysql.releaseConnection();
          //   req.records = {
          //     invalid_input: true,
          //     message: "Cannot Modify System defined Ledgers",
          //   };
          //   next();
          // }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },
  //created by irfan: to
  getOpeningBalance: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    const decimal_places = req.userIdentity.decimal_places;
    _mysql
      .executeQuery({
        query: `select finance_account_head_id,finance_account_child_id,is_opening_bal,
        ROUND(coalesce(debit_amount ,0),${decimal_places}) as debit_amount,  ROUND(coalesce(credit_amount,0),${decimal_places}) as credit_amount,
      root_id,VD.payment_date,VD.payment_type from finance_account_child C inner join 
      finance_account_head H on H.finance_account_head_id=C.head_id and C.finance_account_child_id=?
      left join finance_voucher_details VD  on C.finance_account_child_id=VD.child_id 
      and is_opening_bal='Y' limit 1;`,
        values: [req.query.child_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        if (result.length > 0) {
          if (result[0]["root_id"] == 1 || result[0]["root_id"] == 5) {
            const credit_amount = result[0]["credit_amount"];
            const debit_amount = result[0]["debit_amount"];
            const payment_type = result[0]["payment_type"];
            req.records = {
              opening_bal: payment_type === "CR" ? credit_amount : debit_amount,
              payment_type: result[0]["payment_type"],
              opening_balance_date: result[0]["payment_date"],
            };
            next();
          } else if (
            result[0]["root_id"] == 2 ||
            result[0]["root_id"] == 3 ||
            result[0]["root_id"] == 4
          ) {
            const credit_amount = result[0]["credit_amount"];
            const debit_amount = result[0]["debit_amount"];
            const payment_type = result[0]["payment_type"];
            req.records = {
              opening_bal: payment_type === "DR" ? debit_amount : credit_amount,
              payment_type: result[0]["payment_type"],
              opening_balance_date: result[0]["payment_date"],
            };
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "cant edit opening balance for this ledger",
            };
            next();
          }
        } else {
          req.records = {
            invalid_input: true,
            message: "this ledger is not found",
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getCildLedgers: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;
    const decimal_places = req.userIdentity.decimal_places;

    if (input.root_id > 0 && input.root_id < 6) {
      let strQry = "";

      if (input.root_id == 1 || input.root_id == 5) {
        strQry = `, ROUND((coalesce(sum(VD.debit_amount) ,0.0000)- coalesce(sum(VD.credit_amount) ,0.0000) ),${decimal_places}) as closing_balance `;
      } else {
        strQry = `, ROUND((coalesce(sum(VD.credit_amount) ,0.0000)- coalesce(sum(VD.debit_amount) ,0.0000) ),${decimal_places}) as closing_balance `;
      }
      _mysql
        .executeQuery({
          query: `select finance_account_child_id,ledger_code,arabic_child_name,child_name ${strQry}
          from finance_account_head H inner join  finance_account_child C
          on  H.root_id=? and H.finance_account_head_id=C.head_id        
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
          group by C.finance_account_child_id with rollup;;`,
          values: [input.root_id],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();

          const total = result.pop();
          req.records = { ledgers: result, total: total.closing_balance };
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input",
      };
      next();
    }
  },
  getAccountsExport: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const input = req.query;

      //-------------------start
      _mysql
        .executeQuery({
          query: `select  ledger_code, child_name,root_id, 
            CASE WHEN finance_voucher_id > 0 THEN payment_date else CAST( NOW() AS Date ) END as payment_date, 
            finance_account_child_id,
            CASE WHEN finance_voucher_id >0 THEN payment_type WHEN AH.root_id='1' OR AH.root_id='5' THEN 'DR' else 'CR' END as payment_type,
            CASE WHEN finance_voucher_id >0 and payment_type = 'DR' THEN debit_amount 
            WHEN finance_voucher_id >0 and payment_type = 'CR' THEN credit_amount else '0.00' END as opening_balance,                
            finance_voucher_id, is_opening_bal, 'N' as insert_into_header, AC.head_id, finance_account_child_id
            from finance_account_child AC 
            inner join finance_account_head AH on AH.finance_account_head_id = AC.head_id 
            left join finance_voucher_details VD on VD.child_id = AC.finance_account_child_id  and is_opening_bal='Y'
            group by finance_account_child_id order by root_id;`,
          printQuery: true,
        })
        .then((result) => {
          // and finance_account_child_id <= 142
          _mysql.releaseConnection();

          if (result.length > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              message: "No Record Found",
              invalid_input: true,
            };
            next();
            return;
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  excelOBAccExport(req, res, next) {
    new Promise((resolve, reject) => {
      // const selected_type = req.query.selected_type;

      const sheetName = "Accounts";

      try {
        (async () => {
          //Create instance of excel

          var workbook = new Excel.Workbook();
          workbook.creator = "Algaeh technologies private limited";
          workbook.lastModifiedBy = "Accounts Opening Balance";
          workbook.created = new Date();
          workbook.modified = new Date();
          // Set workbook dates to 1904 date system
          // workbook.properties.date1904 = true;

          //Work worksheet creation
          var worksheet = workbook.addWorksheet(sheetName, {
            properties: { tabColor: { argb: "FFC0000" } },
          });
          //Adding columns
          worksheet.columns = [
            {
              header: "Account Code",
              key: "ledger_code",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Account Name",
              key: "child_name",
              width: 50,
              horizontal: "center",
            },
            {
              header: "Payment Date",
              key: "payment_date",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Insert into Header",
              key: "insert_into_header",
              width: 20,
              // horizontal: "center",
            },
            {
              header: "Payment Type",
              key: "payment_type",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Opening Balance",
              key: "opening_balance",
              width: 20,
              horizontal: "center",
            },
            {
              header: "Amount",
              key: "amount",
              width: 0,
            },
            {
              header: "Voucher Id",
              key: "finance_voucher_id",
              width: 0,
            },
            {
              header: "Root Id",
              key: "root_id",
              width: 0,
            },
            {
              header: "Head Id",
              key: "head_id",
              width: 0,
            },
            {
              header: "Child Id",
              key: "finance_account_child_id",
              width: 0,
            },
          ];

          //Differencate headers
          worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "000000" },
          };
          worksheet.getRow(1).font = {
            name: "calibri",
            family: 4,
            size: 12,
            bold: true,
            color: { argb: "FFFFFF" },
          };
          worksheet.getRow(1).alignment = {
            vertical: "middle",
            horizontal: "center",
          };

          //To freez first column
          worksheet.views = [
            {
              state: "frozen",
              xSplit: 2,
              ySplit: 0,
              activeCell: "A1",
              topLeftCell: "C1",
            },
            {
              state: "frozen",
              xSplit: 0,
              ySplit: 1,
              activeCell: "A1",
            },
          ];

          const data = req.records; //require("../../testDB/data.json");

          // Add a couple of Rows by key-value, after the last current row, using the column keys
          for (let i = 0; i < data.length; i++) {
            const rest = data[i];

            let account_details = {
              ledger_code: rest.ledger_code,
              child_name: rest.child_name,
              root_id: rest.root_id,
              payment_date: rest.payment_date,
              insert_into_header: rest.insert_into_header,
              payment_type: rest.payment_type,
              opening_balance: rest.opening_balance,
              amount: rest.opening_balance,
              finance_voucher_id: rest.finance_voucher_id,
              head_id: rest.head_id,
              finance_account_child_id: rest.finance_account_child_id,
            };

            worksheet.addRow(account_details);
          }

          worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber === 1) {
              row.protection = { locked: true };
            } else {
              row.protection = { locked: false };
              row.eachCell((cell, colNumber) => {
                let value = cell.value;

                cell.alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };
                if (colNumber === 1 || colNumber === 2) {
                  cell.protection = { locked: true };
                }
              });
            }
          });

          // worksheet.addRow(["", selected_type]);
          // worksheet.lastRow.hidden = true;
          await worksheet.protect("algaeh@2019", {
            selectLockedCells: true,
            selectUnlockedCells: true,
          });

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "Report.xlsx"
          );
          workbook.xlsx.write(res).then(function (data) {
            res.end();
          });
        })();
      } catch (e) {
        next(e);
      }
    });
  },

  excelOBAccImport(req, res, next) {
    let buffer = "";
    // const utilities = new algaehUtilities();

    req.on("data", (chunk) => {
      buffer += chunk.toString();
    });
    req.on("end", () => {
      const buff = new Buffer.from(buffer, "base64");
      var workbook = new Excel.Workbook();
      let excelArray = [];
      let properFile = true;

      workbook.xlsx
        .load(buff)
        .then(() => {
          var worksheet = workbook.getWorksheet(1);
          let columns = [];

          worksheet.eachRow(function (row, rowNumber) {
            // console.log("row", row);

            if (rowNumber === 1) {
              columns = row.values;
            } else {
              let internal = {};
              for (let i = 0; i < columns.length; i++) {
                // console.log("columns", columns[i]);
                if (columns[i] !== undefined) {
                  const columnName = columns[i]
                    .replace("Account Code", "ledger_code")
                    .replace("Opening Balance", "opening_balance")
                    .replace("Voucher Id", "finance_voucher_id")
                    .replace("Root Id", "root_id")
                    .replace("Insert into Header", "insert_into_header")
                    .replace("Amount", "amount")
                    .replace("Head Id", "head_id")
                    .replace("Child Id", "finance_account_child_id")
                    .replace("Payment Date", "payment_date")
                    .replace("Payment Type", "payment_type");
                  internal[columnName] = row.values[i];
                  if (i === columns.length - 1) {
                    excelArray.push(internal);
                  }
                }
              }
            }
          });
        })
        .then(() => {
          // console.log("excelArray", excelArray);
          if (properFile) {
            // excelArray.pop();
            req.body = excelArray;
            uploadOBAccounts(req, res, next);
          }
        })
        .catch((error) => {
          next(error);
        });
    });
  },
};
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
    //const utilities = new algaehUtilities();
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
        const BALANCE = child_data.find((f) => {
          return (
            item.finance_account_head_id == f.head_id &&
            item.finance_account_child_id == f.child_id
          );
        });

        let amount = 0;
        let root_id = null;
        if (BALANCE != undefined) {
          root_id = BALANCE.root_id;
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
          ledger_code: item.ledger_code,
          title: item.child_name,
          arabic_account_name: item.arabic_child_name,
          label: item.child_name,
          arabic_child_name: item.arabic_child_name,
          head_id: item["head_id"],
          disabled: false,
          full_name: item.child_full_name,
          leafnode: "Y",
          root_id: root_id,
          created_status: item["child_created_from"],
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        if (!data) {
          //ST---calulating Amount
          const BALANCE = head_data.find((f) => {
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
            ledger_code: item.group_code,
            trans_symbol: trans_symbol,
            subtitle: amount,
            title: item.account_name,
            label: item.account_name,
            full_name: item.group_full_name,
            disabled: true,
            leafnode: "N",
          });
        }
      } else {
        //ST---calulating Amount
        const BALANCE = head_data.find((f) => {
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
          ledger_code: item.group_code,
          trans_symbol: trans_symbol,
          subtitle: amount,
          title: item.account_name,
          label: item.account_name,
          full_name: item.group_full_name,
          disabled: true,
          leafnode: "N",
        });
      }
    }

    // utilities.logger().log("roots:", roots);
    // utilities.logger().log("children:", children);

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
    console.error("MY-ERORR:", e);
  }
}
//created by :IRFAN to calculate the amount of account heads
function calcAmount(account_heads, levels, decimal_places) {
  try {
    return new Promise((resolve, reject) => {
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
      resolve(final_res);
    });
  } catch (e) {
    console.error("am55:", e);
    reject(e);
  }
}

//created by :IRFAN to build tree hierarchy
function createHierarchyForDropdown(arry) {
  try {
    // const onlyChilds = [];
    // const utilities = new algaehUtilities();
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
          account_code: item["account_code"],
          head_id: item["head_id"],
          root_id: item["root_id"],
          disabled: false,
          leafnode: "Y",
          created_status: item["child_created_from"],
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        if (!data) {
          target.push({
            ...item,
            title: item.account_name,
            label: item.account_name,
            disabled: true,
            leafnode: "N",
          });
        }
      } else {
        target.push({
          ...item,
          title: item.account_name,
          label: item.account_name,
          disabled: true,
          leafnode: "N",
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
    console.error("MY-ERORR:", e);
  }
}

//created by irfan:
export function getAccountHeadsFunc(
  decimal_places,
  finance_account_head_id,
  req
) {
  // const utilities = new algaehUtilities();
  const _mysql = new algaehMysql();

  return new Promise(async (resolve, reject) => {
    if (finance_account_head_id > 0 && finance_account_head_id < 6) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (finance_account_head_id == 1 || finance_account_head_id == 5) {
        trans_symbol = "Dr.";
      }

      let // totalYearEnding = 0,
        cred_minus_deb = 0;
      if (finance_account_head_id == 3) {
        const yearEndResult = await _mysql
          .executeQuery({
            query: `select closing_amount,year_start_date,year_end_date,is_active from finance_year_end where is_active=1;`,
            printQuery: true,
          })
          .catch((error) => {
            _mysql.releaseConnection();
            throw error;
          });

        const activeRecord = yearEndResult.find((f) => f.is_active === 1);
        // const totalYearEnding = _.chain(yearEndResult)
        //   .filter((f) => f.is_active === 0)
        //   .sum((s) => s.closing_amount)
        //   .values();

        let active_from_date = undefined,
          active_to_date = undefined;

        if (activeRecord) {
          active_from_date = activeRecord.year_start_date;
          active_to_date = activeRecord.year_end_date;
          const resResult = await axios
            .get(
              "http://localhost:3007/api/v1/profit_and_loss_report/getProfitAndLoss",
              {
                params: {
                  from_date: active_from_date,
                  to_date: active_to_date,
                  display_column_by: "T",
                  levels: 999,
                  nonZero: "Y",
                },
                headers: {
                  "x-api-key": req.headers["x-api-key"],
                  "x-client-ip": req.headers["x-client-ip"],
                },
              }
            )
            .catch((error) => {
              throw error;
            });
          const { data } = resResult;
          const { net_profit } = data.records;
          cred_minus_deb = net_profit?.total;
          // console.log("cred_minus_deb====>", cred_minus_deb);
        } else {
          throw new Error("There is no active entry in year ending.");
        }
      }

      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code,group_code,account_name, arabic_account_name, C.arabic_child_name,\
          C.ledger_code,account_parent,account_level,
          H.created_from as created_status ,sort_order,parent_acc_id,root_id,
          finance_account_child_id,child_name,head_id,C.created_from as child_created_from,
          concat(account_name,' / ',coalesce(group_code,concat('sys-',account_code)),
          case when arabic_account_name is null then ''  else  concat(' / ',arabic_account_name)end ) as group_full_name,
          concat(child_name,' / ',ledger_code,case when arabic_child_name is null then '' 
          else  concat(' / ',arabic_child_name)end ) as child_full_name, account_type
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id
           where root_id=? order by account_level,sort_order;           
           select C.head_id,finance_account_child_id as child_id,child_name,C.arabic_child_name,root_id,account_type
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount, 
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'  
          where H.root_id=?
          group by C.finance_account_child_id;
          select max(account_level) as account_level from finance_account_head 
          where root_id=?;
          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount, account_type
          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A' 
          where H.root_id=?
          group by H.finance_account_head_id  order by account_level;  `,

          values: [
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          let child_data = result[1];

          if (finance_account_head_id == 3) {
            const PandLRecord = result[1].find((f) => f.account_type === "PL");
            const indexOfPandL = result[1].indexOf(PandLRecord);
            result[1][indexOfPandL] = {
              ...PandLRecord,
              cred_minus_deb: cred_minus_deb,
            };
          }
          calcAmount(result[3], result[2], decimal_places)
            .then((head_data) => {
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
            .catch((e) => {
              console.error("m4:", e);
              next(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input",
      });
    }
  });
}

export function getSalesOrderAndPersonId(req, res, next) {
  try {
    if (!req.hims_f_sales_order_id) {
      next();
      return;
    }
    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query: `SELECT sales_order_number,sales_person_id from hims_f_sales_order where hims_f_sales_order_id=?`,
        values: [req.hims_f_sales_order_id],
      })
      .then((result) => {
        req.notificationDetails = _.head(result);
        next();
      })
      .catch((error) => {
        console.error("Error for notification details : ", error);
        next();
      });
  } catch (e) {
    console.error("Error for notification details : ", e);
    next();
  }
}

export async function uploadOBAccounts(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    const input = req.body;
    let _child_id = [];
    input.map((o) => {
      _child_id.push(o.finance_account_child_id);
    });
    const result = await _mysql
      .executeQuery({
        query: `select default_branch_id FROM finance_options limit 1;
        select finance_voucher_id, child_id from finance_voucher_details where 
        is_opening_bal='Y' and child_id in (${_child_id});`,
      })
      .catch((error) => {
        throw error;
      });

    // debit_amount,credit_amount
    // console.log("result", result);
    // consol.log("result", result);
    let voucherStr = "SELECT 1=1;";
    // console.log("input", input);

    for (let i = 0; i < input.length; i++) {
      const data = input[i];
      // console.log("data", data);
      const finance_voucher_exit = result[1].filter(
        (f) => f.child_id === data.finance_account_child_id
      );
      // console.log("finance_voucher_exit", finance_voucher_exit);
      if (finance_voucher_exit.length > 0) {
        if (data.root_id == 1 || data.root_id == 5) {
          if (parseFloat(data.opening_balance) > 0) {
            voucherStr += `update finance_voucher_details set ${
              data.payment_type === "CR" ? "credit_amount" : "debit_amount"
            }=${data.opening_balance},
                   payment_type ='${
                     data.payment_type === "CR" ? "CR" : "DR"
                   }',${
              data.payment_type === "CR" ? "debit_amount" : "credit_amount"
            }=0, payment_date='${
              data.payment_date
                ? moment(data.payment_date).format("YYYY-MM-DD")
                : moment().format("YYYY-MM-DD")
            }', updated_by='${
              req.userIdentity.algaeh_d_app_user_id
            }', updated_date='${moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            )}' 
            where finance_voucher_id=${
              finance_voucher_exit[0].finance_voucher_id
            };`;
          }
        } else if (
          data.root_id == 2 ||
          data.root_id == 3 ||
          data.root_id == 4
        ) {
          if (parseFloat(data.opening_balance) > 0) {
            voucherStr += `update finance_voucher_details set ${
              data.payment_type === "DR" ? "debit_amount" : "credit_amount"
            }=${data.opening_balance},
                    payment_type ='${
                      data.payment_type === "DR" ? "DR" : "CR"
                    }',${
              data.payment_type === "DR" ? "credit_amount" : "debit_amount"
            }=0, payment_date='${
              data.payment_date
                ? moment(data.payment_date).format("YYYY-MM-DD")
                : moment().format("YYYY-MM-DD")
            }', updated_by='${
              req.userIdentity.algaeh_d_app_user_id
            }', updated_date='${moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            )}' 
            where finance_voucher_id=${
              finance_voucher_exit[0].finance_voucher_id
            };`;
          }
        }
      } else {
        // console.log("data", data);
        const voucher_type = data.root_id === 2 ? "purchase" : "sales";
        const { algaeh_d_app_user_id } = req.userIdentity;

        // console.log("numgen");
        let queryGen = { query: "select 1;", printQuery: true };
        if (data.insert_into_header === "Y") {
          const numgen = await _mysql
            .generateRunningNumber({
              user_id: algaeh_d_app_user_id,
              numgen_codes: [voucher_type.toUpperCase()],
              table_name: "finance_numgen",
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
          // .then((numgen) => {
          const month = moment().format("MM");
          const year = moment().format("YYYY");
          const oblStringNumber =
            "OBL" + numgen[voucher_type.toUpperCase()].replace(/[^\d.-]/g, "");
          queryGen = {
            query: ` insert into finance_voucher_header(voucher_type,voucher_no,amount,payment_date,
                        month,year,narration,from_screen,posted_from,created_by,updated_by,invoice_no)
                        value(?,?,?,?,?,?,'Opening Balance Added from Accounts','ACCOUNTS OPENING BALANCE','V',?,?,?);`,
            values: [
              voucher_type,
              numgen[voucher_type.toUpperCase()],
              data.opening_balance,
              data.payment_date
                ? moment(data.payment_date).format("YYYY-MM-DD")
                : new Date(),
              month,
              year,
              algaeh_d_app_user_id,
              algaeh_d_app_user_id,
              oblStringNumber,
            ],
            printQuery: true,
          };
          // })
          // .catch((error) => {
          //   _mysql.rollBackTransaction(() => {
          //     next(error);
          //   });
          // });
        }
        const headerResult = await _mysql
          .executeQuery(queryGen)
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
        // console.log("headerResult", headerResult);
        const { insertId } = headerResult;

        //Added existing statements
        // let insert_data = result[0][0];

        let debit_amount = 0;
        let credit_amount = 0;
        let payment_type = "CR";
        // console.log("data.root_id", data.root_id);
        // console.log("data.opening_balance", data.opening_balance);
        if (
          (data.root_id == 1 || data.root_id == 5) &&
          parseFloat(data.opening_balance) > 0
        ) {
          // console.log("11");
          debit_amount = data.opening_balance;
          payment_type = "DR";

          switch (data.payment_type) {
            case "CR":
              debit_amount = 0;
              credit_amount = data.opening_balance;
              payment_type = "CR";
              break;
          }

          // console.log("data.payment_date", data.payment_date);
          voucherStr += _mysql.mysqlQueryFormat(
            "INSERT INTO finance_voucher_details (voucher_header_id, payment_date, head_id, child_id, \
                            debit_amount, credit_amount, payment_type,hospital_id, year, month, is_opening_bal, \
                            narration, entered_by, auth_status) VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
            [
              insertId,
              data.payment_date
                ? moment(data.payment_date).format("YYYY-MM-DD")
                : new Date(),
              data.head_id,
              data.finance_account_child_id,
              debit_amount,
              credit_amount,
              payment_type,
              result[0][0]["default_branch_id"],
              moment().format("YYYYY"),
              moment().format("M"),
              "Y",
              "Opening Balance Added from Accounts",
              algaeh_d_app_user_id,
              "A",
            ]
          );
        } else if (
          (data.root_id == 2 || data.root_id == 3 || data.root_id == 4) &&
          data.opening_balance > 0
        ) {
          credit_amount = data.opening_balance;
          switch (data.payment_type) {
            case "DR":
              credit_amount = 0;
              debit_amount = data.opening_balance;
              payment_type = "DR";
              break;
          }
          voucherStr += _mysql.mysqlQueryFormat(
            "INSERT INTO finance_voucher_details (voucher_header_id, payment_date, head_id, child_id, \
                            debit_amount, credit_amount, payment_type, hospital_id, year, month, is_opening_bal, \
                            narration,entered_by, auth_status) VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
            [
              insertId,
              data.payment_date
                ? moment(data.payment_date).format("YYYY-MM-DD")
                : new Date(),
              data.head_id,
              data.finance_account_child_id,
              debit_amount,
              credit_amount,
              payment_type,
              result[0][0]["default_branch_id"],
              moment().format("YYYYY"),
              moment().format("M"),
              "Y",
              "Opening Balance Added from Accounts",
              algaeh_d_app_user_id,
              "A",
            ]
          );
        }
        //End of existing statements
      }
      if (i === input.length - 1) {
        _mysql
          .executeQuery({
            query: voucherStr,
            printQuery: true,
          })
          .then((result2) => {
            _mysql.releaseConnection();
            req.records = result2;
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      }
    }
  } catch (e) {
    next(e);
  }
}

export function getAccountForDashBoard(req, res, next) {
  try {
    const _mysql = new algaehMysql();
    const input = req.query;
    _mysql
      .executeQuery({
        query: `select H.root_id , case  H.root_id when 1 then SUM(debit_amount) when 2 then SUM(credit_amount) 
        when 3 then SUM(credit_amount) when 4 then SUM(credit_amount) when 5 then SUM(debit_amount)
        end amount from  finance_account_child as C left join 
        finance_account_head as H on H.finance_account_head_id = C.head_id
        left join finance_voucher_details as VD on VD.head_id = C.head_id
        and VD.child_id = C.finance_account_child_id
        where Date(VD.payment_date) between Date(?) and Date(?) and
        VD.auth_status='A' 
        -- H.root_id in (1,2,3,4,5)
        group by H.root_id ;`,
        values: [input.from_date, input.to_date],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next();
      });
  } catch (e) {
    _mysql.releaseConnection();
    next();
  }
}

export async function postDayEndData(req, res, next) {
  const _mysql = new algaehMysql();

  let input = req.body;

  const headRes = await _mysql.executeQuery({
    query: ` select day_end_header_id,voucher_type,invoice_no,amount,cancel_transaction from (
            select day_end_header_id,voucher_type,amount,invoice_no,cancel_transaction,
            if (sum(debit_amount) =sum(credit_amount) ,'Y','N') as equal 
            from finance_day_end_header H inner join finance_day_end_sub_detail D on
            H.finance_day_end_header_id=D.day_end_header_id and H.posted='N'
            where day_end_header_id =?
            group by day_end_header_id) as A where equal='Y';`,
    values: [input.finance_day_end_header_id],
    printQuery: true,
  });
  // .then((headRes) => {
  if (headRes.length > 0) {
    let total_income = 0;
    let total_expense = 0;
    let balance = 0;
    // const validDayEndHeaderIds = [];
    // result.forEach(item => {
    //   validDayEndHeaderIds.push(item.day_end_header_id);
    // });

    const results = await _mysql.executeQuery({
      query:
        "select D.finance_day_end_sub_detail_id,D.day_end_header_id,D.payment_date,\
                D.head_id,D.child_id,debit_amount,payment_type,credit_amount,D.year,D.month,\
                hospital_id,H.root_id,D.project_id,D.sub_department_id,C.child_name, EH.narration\
                from finance_day_end_sub_detail D  \
                left join finance_account_head H  on D.head_id=H.finance_account_head_id\
                inner join finance_account_child C on D.child_id=C.finance_account_child_id\
                inner join finance_day_end_header EH on EH.finance_day_end_header_id=D.day_end_header_id\
                where  D.day_end_header_id =?;SELECT allow_negative_balance FROM finance_options;\
                SELECT finance_day_end_sub_detail_id FROM finance_day_end_sub_detail where day_end_header_id=?;",
      values: [
        input.finance_day_end_header_id,
        input.finance_day_end_header_id,
      ],
      printQuery: false,
    });
    // .then((results) => {
    const result = results[0];

    const options = results[1][0];
    const _detail = results[2];

    //------------------------------------

    if (result.length === _detail.length) {
      // console.log("result", result.length);
      // console.log("_detail", _detail.length);
      // consol.log("result", result);
      // new Promise(async (resolve, reject) => {
      if (options.allow_negative_balance == "Y") {
        // resolve({});
      } else {
        const child_ids = [];
        result.forEach((child) => {
          child_ids.push(child.child_id);
        });
        const closeBalance = await _mysql.executeQuery({
          query:
            "select child_id,coalesce(sum(credit_amount)- sum(debit_amount),0) as cred_minus_deb,\
                      coalesce(sum(debit_amount)-sum(credit_amount),0) as deb_minus_cred\
                    from finance_voucher_details \
                    where auth_status='A' and child_id in (?) group by child_id;",
          values: [child_ids],
          printQuery: false,
        });
        // .then((closeBalance) => {
        let internal_eror = false;
        //ST-closing balance CHECK
        result.forEach((entry) => {
          //checking debit balance for asset and expence
          if (
            (entry.root_id == 1 || entry.root_id == 5) &&
            entry.payment_type == "CR"
          ) {
            let ledger = closeBalance.find((f) => {
              return f.child_id == entry.child_id;
            });

            if (ledger != undefined) {
              const temp =
                parseFloat(ledger.deb_minus_cred) -
                parseFloat(entry.credit_amount);

              if (temp < 0) {
                internal_eror = true;
                req.records = {
                  invalid_input: true,
                  message: `${entry.child_name} doesn't have debit balance`,
                };
                next();
                return;
              } else {
                ledger.deb_minus_cred = temp;
              }
            } else {
              internal_eror = true;
              req.records = {
                invalid_input: true,
                message: `${entry.child_name} doesn't have debit balance`,
              };
              next();
              return;
            }
          }
          //checking credit balance for liabilty,capital and income
          else if (
            (entry.root_id == 2 || entry.root_id == 3 || entry.root_id == 4) &&
            entry.payment_type == "DR"
          ) {
            let ledger = closeBalance.find((f) => {
              return f.child_id == entry.child_id;
            });

            if (ledger != undefined) {
              const temp =
                parseFloat(ledger.cred_minus_deb) -
                parseFloat(entry.debit_amount);

              if (temp < 0) {
                internal_eror = true;
                req.records = {
                  invalid_input: true,
                  message: `${entry.child_name} doesn't have credit balance`,
                };
                next();
                return;
              } else {
                ledger.deb_minus_cred = temp;
              }
            } else {
              internal_eror = true;
              req.records = {
                invalid_input: true,
                message: `${entry.child_name} doesn't have credit balance`,
              };
              next();
              return;
            }
          }
        });

        //END-closing balance CHECK
        if (internal_eror == false) {
          // resolve({});
        } else {
          next();
        }
        // })
        // .catch((error) => {
        //   _mysql.releaseConnection();
        //   next(error);
        // });
      }
      // }).then(async (res) => {
      // console.log("res:", res);
      //ST-profit and loss calculation
      result.forEach((m) => {
        if (m.root_id == 4) {
          if (m.payment_type == "CR") {
            total_income =
              parseFloat(total_income) + parseFloat(m.credit_amount);
          } else if (m.payment_type == "DR") {
            total_income =
              parseFloat(total_income) - parseFloat(m.debit_amount);
          }
        } else if (m.root_id == 5) {
          if (m.payment_type == "DR") {
            total_expense =
              parseFloat(total_expense) + parseFloat(m.debit_amount);
          } else if (m.payment_type == "CR") {
            total_expense =
              parseFloat(total_expense) - parseFloat(m.credit_amount);
          }
        }
      });
      //END-profit and loss calculation
      balance = parseFloat(total_income) - parseFloat(total_expense);

      let pl_account = "";
      if (balance > 0) {
        pl_account = {
          payment_date: result[0]["payment_date"],
          head_id: 3,
          child_id: 1,
          debit_amount: 0,
          credit_amount: balance,
          payment_type: "CR",
          hospital_id: result[0]["hospital_id"],
          year: moment().format("YYYY"),
          month: moment().format("M"),
          narration: result[0]["narration"],
        };
      } else if (balance < 0) {
        pl_account = {
          payment_date: result[0]["payment_date"],
          head_id: 3,
          child_id: 1,
          debit_amount: Math.abs(balance),
          credit_amount: 0,
          payment_type: "DR",
          hospital_id: result[0]["hospital_id"],
          year: moment().format("YYYY"),
          month: moment().format("M"),
          narration: result[0]["narration"],
        };
      }

      let strQry = "";
      // let updateQry = "";
      //Commented by noor coz voucher header id is not showing in pandl accounts this code moved down
      // if (pl_account != "") {
      //   strQry += _mysql.mysqlQueryFormat(
      //     "INSERT INTO finance_voucher_details (payment_date,head_id,child_id,debit_amount,credit_amount,\
      //         payment_type,hospital_id,year,month,pl_entry,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?);",
      //     [
      //       pl_account.payment_date,
      //       pl_account.head_id,
      //       pl_account.child_id,
      //       pl_account.debit_amount,
      //       pl_account.credit_amount,
      //       pl_account.payment_type,
      //       pl_account.hospital_id,
      //       pl_account.year,
      //       pl_account.month,
      //       "Y",
      //       req.userIdentity.algaeh_d_app_user_id,
      //       "A",
      //     ]
      //   );
      // }
      //End commented by noor
      const headRes = await _mysql.executeQueryWithTransaction({
        query:
          "insert into finance_voucher_header (voucher_type,voucher_no,day_end_header_id,amount,\
                      payment_date,narration,from_screen,posted_from,year,month,invoice_no,ref_no,cheque_date,cheque_amount,due_date)\
                      select voucher_type,document_number,finance_day_end_header_id,amount,transaction_date,\
                      narration,from_screen,'D',year(transaction_date),month(transaction_date), \
                      invoice_no,ref_no,cheque_date,cheque_amount,due_date\
                      from finance_day_end_header where finance_day_end_header_id=? ",
        values: [input.finance_day_end_header_id],
        printQuery: false,
      });
      // .then((headRes) => {
      const insertColumns = [
        "payment_date",
        "head_id",
        "child_id",
        "debit_amount",
        "credit_amount",
        "payment_type",
        "hospital_id",
        "year",
        "month",
        "project_id",
        "sub_department_id",
        "narration",
      ];
      const result2 = await _mysql.executeQueryWithTransaction({
        query: "insert into finance_voucher_details (??) values ?;",
        values: result,
        includeValues: insertColumns,
        bulkInsertOrUpdate: true,
        extraValues: {
          voucher_header_id: headRes.insertId,
          auth_status: "A",
        },
        printQuery: true,
      });
      // .then((result2) => {
      if (pl_account != "") {
        strQry += _mysql.mysqlQueryFormat(
          "INSERT INTO finance_voucher_details (payment_date,head_id,child_id,debit_amount,credit_amount,\
                              payment_type,hospital_id,year,month,narration,pl_entry,entered_by,auth_status,voucher_header_id)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
          [
            pl_account.payment_date,
            pl_account.head_id,
            pl_account.child_id,
            pl_account.debit_amount,
            pl_account.credit_amount,
            pl_account.payment_type,
            pl_account.hospital_id,
            pl_account.year,
            pl_account.month,
            pl_account.narration,
            "Y",
            req.userIdentity.algaeh_d_app_user_id,
            "A",
            headRes.insertId,
          ]
        );
      }
      const result3 = await _mysql.executeQueryWithTransaction({
        query:
          " update finance_day_end_header set posted='Y' ,posted_date=CURDATE(),posted_by=? where \
                          finance_day_end_header_id=?;" +
          strQry,
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          input.finance_day_end_header_id,
        ],
        printQuery: true,
      });
      // .then((result3) => {
      _mysql.commitTransaction(() => {
        _mysql.releaseConnection();
        req.records = result3;
        if (!req.preventNext) {
          next();
        }
      });
      // })
      // .catch((e) => {
      //   _mysql.rollBackTransaction(() => {
      //     next(e);
      //   });
      // });
      // })
      // .catch((e) => {
      //   _mysql.rollBackTransaction(() => {
      //     next(e);
      //   });
      // });
      // })
      // .catch((e) => {
      //   _mysql.rollBackTransaction(() => {
      //     next(e);
      //   });
      // });
      // });
    } else {
      _mysql.releaseConnection();
      req.records = {
        invalid_input: true,
        message: "Accounts not matching, Please contact admin..",
      };
      next();
    }

    //------------------------------------------------
    // })
    // .catch((e) => {
    //   _mysql.rollBackTransaction(() => {
    //     next(e);
    //   });
    // });
  } else {
    _mysql.releaseConnection();
    req.records = {
      invalid_input: true,
      message: "Credit and Debit are not equal",
    };
    next();
  }
  // })
  // .catch((e) => {
  //   _mysql.rollBackTransaction(() => {
  //     next(e);
  //   });
  // });
}

export function bulkPosttoFinance(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk.toString();
    });

    req.on("end", async () => {
      const input = JSON.parse(buffer);

      let post_done = [];
      for (let i = 0; i < input.day_end_list.length; i++) {
        let item = input.day_end_list[i];
        req.body = {
          ...item,
        };
        req.preventNext = true;

        const xyz = await postDayEndData(req, res, next);
        post_done.push(xyz);
      }
      Promise.all(post_done)
        .then(() => {
          console.log("34567");
          next();
          // _mysql.commitTransaction(() => {
          //   _mysql.releaseConnection();
          //   next();
          // });
        })
        .catch((e) => {
          throw e;
        });
    });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
