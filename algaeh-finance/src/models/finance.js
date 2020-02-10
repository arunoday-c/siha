import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getAccountHeads_BKP_24_dec: (req, res, next) => {
    const utilities = new algaehUtilities();
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
            input.finance_account_head_id
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

              req.records = outputArray;
              next();
            })
            .catch(e => {
              console.log("m4:", e);
              next(e);
            });
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

  //created by irfan:
  getAccountHeads_JAN_9_2020: (req, res, next) => {
    const utilities = new algaehUtilities();
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
            input.finance_account_head_id
          ],
          printQuery: false
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

              req.records = outputArray;
              next();
            })
            .catch(e => {
              console.log("m4:", e);
              next(e);
            });
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
  //created by irfan:
  getAccountHeads: (req, res, next) => {
    const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;
    const decimal_places = req.userIdentity.decimal_places;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 6
    ) {
      getAccountHeadsFunc(decimal_places, input.finance_account_head_id)
        .then(result => {
          req.records = [result];
          next();
        })
        .catch(e => {
          next(e);
        });
    } else if (input.getAll == "Y") {
      getAccountHeadsFunc(decimal_places, 1)
        .then(asset => {
          getAccountHeadsFunc(decimal_places, 2)
            .then(liability => {
              getAccountHeadsFunc(decimal_places, 3)
                .then(capital => {
                  getAccountHeadsFunc(decimal_places, 4)
                    .then(income => {
                      getAccountHeadsFunc(decimal_places, 5)
                        .then(expense => {
                          req.records = [
                            asset,
                            liability,
                            capital,
                            income,
                            expense
                          ];
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
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide Valid Input"
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
          printQuery: false
        })
        .then(result => {
          if (result.insertId > 0) {
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `finance_head_m_child` (head_id,child_id,created_from)  VALUE(?,?,?);",
                values: [input.finance_account_head_id, result.insertId, "U"],
                printQuery: false
              })
              .then(detail => {
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
                        "Opening Balance",
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date()
                      ],
                      printQuery: false
                    })
                    .then(subdetail => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = {
                          head_id: input.finance_account_head_id,
                          child_id: result.insertId
                        };
                        next();
                      });
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      head_id: input.finance_account_head_id,
                      child_id: result.insertId
                    };
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
        select coalesce(max(sort_order),0)as sort_order FROM finance_account_head where parent_acc_id=?;\
        select case  group_type when 'P' then finance_account_head_id else root_id end as root_id from\
        finance_account_head where finance_account_head_id=?;",
          values: [
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id,
            input.finance_account_head_id
          ],
          printQuery: false
        })
        .then(result => {
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
                root_id
              ],
              printQuery: false
            })
            .then(resul => {
              _mysql.releaseConnection();
              req.records = {
                account_code: account_code,
                finance_account_head_id: resul.insertId
              };
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
  addAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    //. const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQuery({
          query:
            "select   root_id from finance_account_head where finance_account_head_id=?; ",
          values: [input.finance_account_head_id]
        })
        .then(result => {
          const root_id = result[0]["root_id"];
          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO `finance_account_child` (child_name,head_id,created_from\
            ,created_date, created_by, updated_date, updated_by)  VALUE(?,?,?,?,?,?,?)",
              values: [
                input.account_name,
                input.finance_account_head_id,
                "U",
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id
              ],
              printQuery: false
            })
            .then(result => {
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
                        new Date(),
                        "A",
                        "Y"
                      ],
                      printQuery: false
                    })
                    .then(subdetail => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = {
                          head_id: input.finance_account_head_id,
                          child_id: result.insertId
                        };
                        next();
                      });
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      head_id: input.finance_account_head_id,
                      child_id: result.insertId
                    };
                    next();
                  });
                }
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
            })
            .catch(error => {
              _mysql.releaseConnection();
              next(error);
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
            input.finance_account_head_id
          ],
          printQuery: false
        })
        .then(result => {
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
                   group_type,account_level,created_from,sort_order,parent_acc_id,hierarchy_path,root_id\
                ,created_date, created_by, updated_date, updated_by)\
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id
              ],
              printQuery: false
            })
            .then(resul => {
              _mysql.releaseConnection();
              req.records = {
                account_code: account_code,
                finance_account_head_id: resul.insertId
              };
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
      strQry += `update finance_accounts_maping set child_id=${item.child_id},head_id=${item.head_id}
       where account='${item.account}';`;
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

    const input = req.query;
    let str = "";

    if (input.accounts != undefined && input.accounts.length > 0) {
      str = ` where account in (${input.accounts})`;
    }

    _mysql
      .executeQuery({
        query: `select account,child_id,M.head_id,H.account_name,C.child_name from \
          finance_accounts_maping M left join finance_account_head H\
          on M.head_id=H.finance_account_head_id left join finance_account_child C \
          on M.child_id=C.finance_account_child_id  ${str};`,

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
    const decimal_places = req.userIdentity.decimal_places;
    let input = req.query;

    let strQry = "";

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

    if (input.document_number !== undefined && input.document_number != null) {
      strQry += ` and  H.document_number like '%${input.document_number}%' `;
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

    _mysql
      .executeQuery({
        query: `select finance_day_end_header_id, transaction_date,    
        ROUND( amount , ${decimal_places}) as amount, voucher_type, document_number,  
        invoice_no, screen_name, ref_no as cheque_no,cheque_date, 
         ROUND( cheque_amount , ${decimal_places}) as  cheque_amount, narration, 
        U.username as entered_by, entered_date from finance_day_end_header H 
        left join  algaeh_d_app_screens S on H.from_screen=S.screen_code
        left join algaeh_d_app_user U on H.entered_by=U.algaeh_d_app_user_id
        where ${strQry}; `,

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
  postDayEndData_BKP_14_JAN_2020: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;

    // select distinct  finance_day_end_sub_detail_id,day_end_header_id,payment_date,head_account_code,
    // head_id,child_id,debit_amount,payment_type,credit_amount,narration,year,month,hospital_id
    // from finance_day_end_sub_detail where day_end_header_id in (?);

    _mysql
      .executeQueryWithTransaction({
        query:
          "insert into finance_voucher_header (voucher_type,voucher_no,day_end_header_id,amount,\
            payment_date,narration,from_screen,posted_from)\
            select voucher_type,document_number,finance_day_end_header_id,amount,transaction_date,\
            narration,from_screen,'D' from finance_day_end_header where finance_day_end_header_id in(?) ",
        values: [input.finance_day_end_header_ids],
        printQuery: false
      })
      .then(headRes => {
        _mysql
          .executeQuery({
            query: `  WITH cte_  AS (
          SELECT finance_day_end_sub_detail_id, day_end_header_id, payment_date,
          case when sum(debit_amount)= sum(credit_amount)then 'true' else 'false'  end as is_equal,transaction_type FROM finance_day_end_header H inner join
          finance_day_end_sub_detail SD on H.finance_day_end_header_id=day_end_header_id
          where SD.is_deleted='N' and day_end_header_id in (?)
          group by day_end_header_id)
          select D.finance_day_end_sub_detail_id,D.day_end_header_id,D.payment_date,
          head_id,child_id,debit_amount,payment_type,credit_amount,year,month,hospital_id,AH.root_id,D.project_id,D.sub_department_id
          from finance_day_end_sub_detail D inner join  cte_ C on D.day_end_header_id=C.day_end_header_id   
          left join finance_account_head AH  on D.head_id=AH.finance_account_head_id
          where  D.day_end_header_id in (SELECT day_end_header_id
          FROM cte_ where is_equal='true');`,
            values: [input.finance_day_end_header_ids],
            printQuery: false
          })
          .then(result => {
            // _mysql.releaseConnection();
            // req.records = result;
            // next();
            if (result.length > 0) {
              // const updateFinanceDayEndSubDetailIds = result.map(m => {
              //   return m.finance_day_end_sub_detail_id;
              // });
              const updateFinanceDayEndSubDetailIds = [];
              let total_income = 0;
              let total_expense = 0;
              let balance = 0;
              result.forEach(m => {
                updateFinanceDayEndSubDetailIds.push(
                  m.finance_day_end_sub_detail_id
                );

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
                result.push({
                  payment_date: new Date(),
                  head_account_code: 3.1,
                  root_id: 3,
                  head_id: 3,
                  child_id: 1,
                  debit_amount: 0,
                  credit_amount: balance,
                  payment_type: "CR",

                  hospital_id: result[0]["hospital_id"],
                  year: moment().format("YYYY"),
                  month: moment().format("M"),
                  voucher_no: null
                });
              } else if (balance < 0) {
                result.push({
                  payment_date: new Date(),
                  head_account_code: 3.1,
                  root_id: 3,
                  head_id: 3,
                  child_id: 1,
                  debit_amount: Math.abs(balance),
                  credit_amount: 0,
                  payment_type: "DR",

                  hospital_id: result[0]["hospital_id"],
                  year: moment().format("YYYY"),
                  month: moment().format("M"),
                  voucher_no: null
                });
              }

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
                "sub_department_id"
              ];
              _mysql
                .executeQueryWithTransaction({
                  query: "insert into finance_voucher_details (??) values ?;",
                  values: result,
                  includeValues: insertColumns,
                  bulkInsertOrUpdate: true,
                  extraValues: {
                    voucher_header_id: headRes.insertId,
                    auth_status: "A"
                  },
                  printQuery: false
                })
                .then(result2 => {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "update finance_day_end_sub_detail set posted='Y' ,posted_date=now(),\
                          posted_by=? where   finance_day_end_sub_detail_id in (?) ",
                      values: [
                        req.userIdentity.algaeh_d_app_user_id,
                        updateFinanceDayEndSubDetailIds
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
                message: "Credit and Debit are not equal"
              };
              next();
            }
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: to
  postDayEndData_BKP_24_JAN_2020: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;

    // select distinct  finance_day_end_sub_detail_id,day_end_header_id,payment_date,head_account_code,
    // head_id,child_id,debit_amount,payment_type,credit_amount,narration,year,month,hospital_id
    // from finance_day_end_sub_detail where day_end_header_id in (?);

    _mysql
      .executeQuery({
        query: `  WITH cte_  AS (
            SELECT finance_day_end_sub_detail_id, day_end_header_id, payment_date,
            case when sum(debit_amount)= sum(credit_amount)then 'true' else 'false'  end as is_equal,transaction_type FROM finance_day_end_header H inner join
            finance_day_end_sub_detail SD on H.finance_day_end_header_id=day_end_header_id
            where SD.is_deleted='N' and day_end_header_id in (?)
            group by day_end_header_id)
            select D.finance_day_end_sub_detail_id,D.day_end_header_id,D.payment_date,
            head_id,child_id,debit_amount,payment_type,credit_amount,year,month,hospital_id,AH.root_id,D.project_id,D.sub_department_id
            from finance_day_end_sub_detail D inner join  cte_ C on D.day_end_header_id=C.day_end_header_id   
            left join finance_account_head AH  on D.head_id=AH.finance_account_head_id
            where  D.day_end_header_id in (SELECT day_end_header_id
            FROM cte_ where is_equal='true');`,
        values: [input.finance_day_end_header_ids],
        printQuery: false
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();
        if (result.length > 0) {
          // const updateFinanceDayEndSubDetailIds = result.map(m => {
          //   return m.finance_day_end_sub_detail_id;
          // });
          const updateFinanceDayEndSubDetailIds = [];
          const validDayEndHeaderIds = [];
          let total_income = 0;
          let total_expense = 0;
          let balance = 0;

          result.forEach(m => {
            updateFinanceDayEndSubDetailIds.push(
              m.finance_day_end_sub_detail_id
            );
            validDayEndHeaderIds.push(m.day_end_header_id);

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
            result.push({
              payment_date: new Date(),
              head_account_code: 3.1,
              root_id: 3,
              head_id: 3,
              child_id: 1,
              debit_amount: 0,
              credit_amount: balance,
              payment_type: "CR",

              hospital_id: result[0]["hospital_id"],
              year: moment().format("YYYY"),
              month: moment().format("M"),
              voucher_no: null
            });
          } else if (balance < 0) {
            result.push({
              payment_date: new Date(),
              head_account_code: 3.1,
              root_id: 3,
              head_id: 3,
              child_id: 1,
              debit_amount: Math.abs(balance),
              credit_amount: 0,
              payment_type: "DR",

              hospital_id: result[0]["hospital_id"],
              year: moment().format("YYYY"),
              month: moment().format("M"),
              voucher_no: null
            });
          }

          _mysql
            .executeQueryWithTransaction({
              query:
                "insert into finance_voucher_header (voucher_type,voucher_no,day_end_header_id,amount,\
                      payment_date,narration,from_screen,posted_from)\
                      select voucher_type,document_number,finance_day_end_header_id,amount,transaction_date,\
                      narration,from_screen,'D' from finance_day_end_header where finance_day_end_header_id in(?) ",
              values: [validDayEndHeaderIds],
              printQuery: true
            })
            .then(headRes => {
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
                "sub_department_id"
              ];
              _mysql
                .executeQueryWithTransaction({
                  query: "insert into finance_voucher_details (??) values ?;",
                  values: result,
                  includeValues: insertColumns,
                  bulkInsertOrUpdate: true,
                  extraValues: {
                    voucher_header_id: headRes.insertId,
                    auth_status: "A"
                  },
                  printQuery: false
                })
                .then(result2 => {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "update finance_day_end_sub_detail set posted='Y' ,posted_date=now(),\
                   posted_by=? where   finance_day_end_sub_detail_id in (?) ",
                      values: [
                        req.userIdentity.algaeh_d_app_user_id,
                        updateFinanceDayEndSubDetailIds
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
            message: "Credit and Debit are not equal"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
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
        printQuery: true
      })
      .then(result => {
        if (result.length > 0) {
          let total_income = 0;
          let total_expense = 0;
          let balance = 0;
          const validDayEndHeaderIds = [];
          result.forEach(item => {
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
              printQuery: true
            })
            .then(details => {
              details.forEach(m => {
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
                  voucher_no: null
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
                  voucher_no: null
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
                  printQuery: true
                })
                .then(headRes => {
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
                    "sub_department_id"
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
                        auth_status: "A"
                      },
                      printQuery: false
                    })
                    .then(result2 => {
                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            " update finance_day_end_header set posted='Y' ,posted_date=CURDATE(),posted_by=? where \
                            finance_day_end_header_id in(?);",
                          values: [
                            req.userIdentity.algaeh_d_app_user_id,
                            validDayEndHeaderIds
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
            message: "Credit and Debit are not equal"
          };
          next();
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },
    //created by irfan: to
    postDayEndData: (req, res, next) => {
      const _mysql = new algaehMysql();

      let input = req.body;

      _mysql
        .executeQuery({
          query: ` select day_end_header_id,voucher_type,invoice_no,amount,cancel_transaction from (
              select day_end_header_id,voucher_type,amount,invoice_no,cancel_transaction,
              if (sum(debit_amount) =sum(credit_amount) ,'Y','N') as equal 
              from finance_day_end_header H inner join finance_day_end_sub_detail D on
              H.finance_day_end_header_id=D.day_end_header_id and H.posted='N'
              where day_end_header_id =?
              group by day_end_header_id) as A where equal='Y';`,
          values: [input.finance_day_end_header_id],
          printQuery: true
        })
        .then(headRes => {
          if (headRes.length > 0) {
            let total_income = 0;
            let total_expense = 0;
            let balance = 0;
            // const validDayEndHeaderIds = [];
            // result.forEach(item => {
            //   validDayEndHeaderIds.push(item.day_end_header_id);
            // });

            _mysql
              .executeQuery({
                query:
                  "select D.finance_day_end_sub_detail_id,D.day_end_header_id,D.payment_date,\
                  D.head_id,D.child_id,debit_amount,payment_type,credit_amount,year,month,\
                  hospital_id,H.root_id,D.project_id,D.sub_department_id,C.child_name\
                  from finance_day_end_sub_detail D  \
                  left join finance_account_head H  on D.head_id=H.finance_account_head_id\
                  inner join finance_account_child C on D.child_id=C.finance_account_child_id\
                  where  D.day_end_header_id =?",
                values: [input.finance_day_end_header_id],
                printQuery: true
              })
              .then(result => {
                const child_ids = [];
                result.forEach(child => {
                  child_ids.push(child.child_id);
                });

                //------------------------------------

                new Promise((resolve, reject) => {
                  _mysql
                    .executeQuery({
                      query:
                        "select child_id,coalesce(sum(credit_amount)- sum(debit_amount),0) as cred_minus_deb,\
                        coalesce(sum(debit_amount)-sum(credit_amount),0) as deb_minus_cred\
                      from finance_voucher_details \
                      where auth_status='A' and child_id in (?) group by child_id;",
                      values: [child_ids],
                      printQuery: false
                    })
                    .then(closeBalance => {
                      let internal_eror = false;
                      //ST-closing balance CHECK
                      result.forEach(entry => {
                        //checking debit balance for asset and expence
                        if (
                          (entry.root_id == 1 || entry.root_id == 5) &&
                          entry.payment_type == "CR"
                        ) {
                          let ledger = closeBalance.find(f => {
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
                                message: `${entry.child_name} doesn't have debit balance`
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
                              message: `${entry.child_name} doesn't have debit balance`
                            };
                            next();
                            return;
                          }
                        }
                        //checking credit balance for liabilty,capital and income
                        else if (
                          (entry.root_id == 2 ||
                            entry.root_id == 3 ||
                            entry.root_id == 4) &&
                          entry.payment_type == "DR"
                        ) {
                          let ledger = closeBalance.find(f => {
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
                                message: `${entry.child_name} doesn't have credit balance`
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
                              message: `${entry.child_name} doesn't have credit balance`
                            };
                            next();
                            return;
                          }
                        }
                      });

                      //END-closing balance CHECK
                      if (internal_eror == false) {
                        resolve({});
                      } else {
                        next();
                      }
                    })
                    .catch(error => {
                      _mysql.releaseConnection();
                      next(error);
                    });
                }).then(res => {
                  console.log("res:", res);
                  //ST-profit and loss calculation
                  result.forEach(m => {
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
                      payment_date: new Date(),
                      head_id: 3,
                      child_id: 1,
                      debit_amount: 0,
                      credit_amount: balance,
                      payment_type: "CR",
                      hospital_id: result[0]["hospital_id"],
                      year: moment().format("YYYY"),
                      month: moment().format("M")
                    };
                  } else if (balance < 0) {
                    pl_account = {
                      payment_date: new Date(),
                      head_id: 3,
                      child_id: 1,
                      debit_amount: Math.abs(balance),
                      credit_amount: 0,
                      payment_type: "DR",
                      hospital_id: result[0]["hospital_id"],
                      year: moment().format("YYYY"),
                      month: moment().format("M")
                    };
                  }

                  let strQry = "";
                  let updateQry = "";

                  if (pl_account != "") {
                    strQry += _mysql.mysqlQueryFormat(
                      "INSERT INTO finance_voucher_details (payment_date,head_id,child_id,debit_amount,credit_amount,\
                        payment_type,hospital_id,year,month,pl_entry,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?);",
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
                        "Y",
                        req.userIdentity.algaeh_d_app_user_id,
                        "A"
                      ]
                    );
                  }

                  new Promise((resolve, reject) => {
                    // PAYMENT AGAINST OLD PENDING VOUCHER
                    if (
                  
                      headRes[0]["invoice_no"] != null
                    ) {
                      _mysql
                        .executeQuery({
                          query:
                            "select finance_voucher_header_id, voucher_type,amount,settlement_status,settled_amount\
                          from finance_voucher_header where invoice_no=? and voucher_type in ('purchase' ,'sales') and settlement_status='P';",
                          values: [headRes[0]["invoice_no"]],
                          printQuery: false
                        })
                        .then(BalanceInvoice => {
                          // if (headRes[0]["cancel_transaction"] == "Y") {
                          //   updateQry = `update finance_voucher_header set settlement_status='C' where finance_voucher_header_id=${BalanceInvoice[0]["finance_voucher_header_id"]};`;
                          // } else 
                          if (headRes[0]["voucher_type"] == "credit_note"||headRes[0]["voucher_type"] == "debit_note"|| headRes[0]["voucher_type"] == "payment"||headRes[0]["voucher_type"] == "receipt") {
                            const total_paid_amount =
                              parseFloat(BalanceInvoice[0]["settled_amount"]) +
                              parseFloat(headRes[0]["amount"]);

                            if (
                              parseFloat(BalanceInvoice[0]["amount"]) ==
                              total_paid_amount
                            ) {
                              updateQry = `update finance_voucher_header set settlement_status='S',settled_amount=settled_amount+${parseFloat(
                                headRes[0]["amount"]
                              )} where finance_voucher_header_id=${
                                BalanceInvoice[0]["finance_voucher_header_id"]
                              };`;
                            } else {
                              updateQry = `update finance_voucher_header set settled_amount=settled_amount+${parseFloat(
                                headRes[0]["amount"]
                              )} where finance_voucher_header_id=${
                                BalanceInvoice[0]["finance_voucher_header_id"]
                              };`;
                            }
                          }



          

                          resolve({});
                        })
                        .catch(error => {
                          _mysql.releaseConnection();
                          next(error);
                        });
                    }
                              
                    
                    else {
                      resolve({});
                    }
                  }).then(Invoc => {
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "insert into finance_voucher_header (voucher_type,voucher_no,day_end_header_id,amount,\
                            payment_date,narration,from_screen,posted_from,year,month,invoice_no,ref_no,cheque_date,cheque_amount)\
                            select voucher_type,document_number,finance_day_end_header_id,amount,transaction_date,\
                            narration,from_screen,'D',year(transaction_date),month(transaction_date), \
                            invoice_no,ref_no,cheque_date,cheque_amount\
                            from finance_day_end_header where finance_day_end_header_id=? ",
                        values: [input.finance_day_end_header_id],
                        printQuery: true
                      })
                      .then(headRes => {
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
                          "sub_department_id"
                        ];
                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "insert into finance_voucher_details (??) values ?;",
                            values: result,
                            includeValues: insertColumns,
                            bulkInsertOrUpdate: true,
                            extraValues: {
                              voucher_header_id: headRes.insertId,
                              auth_status: "A"
                            },
                            printQuery: false
                          })
                          .then(result2 => {
                            _mysql
                              .executeQueryWithTransaction({
                                query:
                                  " update finance_day_end_header set posted='Y' ,posted_date=CURDATE(),posted_by=? where \
                                finance_day_end_header_id=?;" +
                                  strQry +
                                  "" +
                                  updateQry,
                                values: [
                                  req.userIdentity.algaeh_d_app_user_id,
                                  input. finance_day_end_header_id
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
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  });
                });

                //------------------------------------------------
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
              message: "Credit and Debit are not equal"
            };
            next();
          }
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    },

  //created by irfan: before removing child maping
  removeAccountHead_BKP_24_dec: (req, res, next) => {
    const _mysql = new algaehMysql();
    // const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQuery({
          query: `SELECT finance_head_m_child_id,created_from FROM finance_head_m_child where \
                head_id=? and child_id=?;\
                select finance_voucher_id from finance_voucher_details where head_id=? and child_id=? limit 1;`,
          values: [
            input.head_id,
            input.child_id,
            input.head_id,
            input.child_id
          ],
          printQuery: false
        })
        .then(result => {
          if (result[0][0]["created_from"] == "S") {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cant Delete System Generated Account "
            };
            next();
          } else {
            if (result[1].length > 0) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Transactions Found Cant Delete this Account "
              };
              next();
            } else {
              _mysql
                .executeQueryWithTransaction({
                  query: `delete FROM finance_head_m_child where finance_head_m_child_id=?;            
                    delete from finance_account_child where finance_account_child_id=?;`,
                  values: [
                    result[0][0]["finance_head_m_child_id"],
                    input.child_id
                  ],
                  printQuery: false
                })
                .then(resu => {
                  // _mysql.releaseConnection();
                  // req.records = resu;
                  // next();

                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = resu;
                    next();
                  });
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else if (input.leaf_node == "N") {
      _mysql
        .executeQuery({
          query: `SELECT finance_account_head_id, created_from FROM finance_account_head\
                   where finance_account_head_id=?;\
                select finance_voucher_id from finance_voucher_details where head_id in  (
                  with recursive cte  as (          
                    select  finance_account_head_id
                    from finance_account_head where finance_account_head_id=?
                    union                  
                    select H.finance_account_head_id
                    from finance_account_head  H inner join cte
                    on H.parent_acc_id = cte.finance_account_head_id    
                    )select * from cte
                ); with recursive cte  as (          
                  select  finance_account_head_id,PC.child_id
                  from finance_account_head P left join finance_head_m_child PC on P.finance_account_head_id
                  =PC.head_id where finance_account_head_id=?
                  union                  
                  select H.finance_account_head_id,PC.child_id
                  from finance_account_head  H inner join cte
                  on H.parent_acc_id = cte.finance_account_head_id   left join finance_head_m_child PC on H.finance_account_head_id
                  =PC.head_id 
                  )select * from cte`,
          values: [input.head_id, input.head_id, input.head_id],
          printQuery: false
        })
        .then(result => {
          if (result[0][0]["created_from"] == "S") {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cant Delete System Generated Account Heads"
            };
            next();
          } else {
            if (result[1].length > 0) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Transactions Found Cant Delete this Account "
              };
              next();
            } else {
              const head_ids = result[2].map(m => m.finance_account_head_id);
              const child_ids = result[2]
                .filter(f => {
                  return f.child_id > 0;
                })
                .map(m => m.child_id);

              let delete_childs = "";

              if (child_ids.length > 0) {
                delete_childs = `   delete from finance_account_child where finance_account_child_id in (${child_ids});`;
              }
              _mysql
                .executeQueryWithTransaction({
                  query: `delete FROM finance_head_m_child where head_id in (${head_ids});          
                    ${delete_childs}
                    delete from finance_account_head  where finance_account_head_id in (${head_ids});`,
                  values: [input.head_id, input.child_id, input.head_id],
                  printQuery: false
                })
                .then(resu => {
                  // _mysql.releaseConnection();
                  // req.records = resu;
                  // next();

                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = resu;
                    next();
                  });
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
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
            input.child_id
          ],
          printQuery: false
        })
        .then(result => {
          if (result[0][0]["created_from"] == "S") {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cant Delete System Generated Account "
            };
            next();
          } else {
            if (result[1].length > 0) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Transactions Found Cant Delete this Account "
              };
              next();
            } else {
              _mysql
                .executeQueryWithTransaction({
                  query: ` delete from finance_account_child where finance_account_child_id=?;`,
                  values: [input.child_id],
                  printQuery: false
                })
                .then(resu => {
                  // _mysql.releaseConnection();
                  // req.records = resu;
                  // next();

                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = resu;
                    next();
                  });
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          }
        })
        .catch(e => {
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
          printQuery: false
        })
        .then(result => {
          if (result[0][0]["created_from"] == "S") {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cant Delete System Generated Account Heads"
            };
            next();
          } else {
            const head_ids = result[1].map(m => m.finance_account_head_id);
            _mysql
              .executeQuery({
                query: `select finance_voucher_id from finance_voucher_details where head_id in  (?)`,
                values: [head_ids],
                printQuery: false
              })
              .then(resul => {
                if (resul.length > 0) {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: "Transactions Found ,Cant Delete this Account "
                  };
                  next();
                } else {
                  _mysql
                    .executeQueryWithTransaction({
                      query: `delete from finance_account_child where head_id in (?);                    
                        delete from finance_account_head  where finance_account_head_id in (?);`,
                      values: [head_ids, head_ids],
                      printQuery: false
                    })
                    .then(deleteRes => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = deleteRes;
                        next();
                      });
                    })
                    .catch(e => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },

  //created by irfan: to
  previewDayEndEntries: (req, res, next) => {
    const _mysql = new algaehMysql();

    // select finance_day_end_sub_detail_id ,payment_date,SD.head_id,
    //     child_id,concat(account_name,'-->',child_name ) as to_account,debit_amount,
    //     case payment_type when 'CR' then 'Credit' else 'Debit' end
    //      as payment_type,credit_amount
    //     from finance_day_end_sub_detail SD left join finance_account_head H on SD.head_id=H.finance_account_head_id
    //     left join finance_account_child C on SD.child_id=C.finance_account_child_id where day_end_header_id=?;
    //     select coalesce(sum(cash),0)as cash,coalesce(sum(card),0)as card,coalesce(sum(cheque),0)as cheque
    //     from (select  case when payment_mode = "CA" then amount end as cash,
    //     case when payment_mode = "CD" then amount end as card,
    //     case when payment_mode = "CH" then amount end as cheque
    //     from finance_day_end_detail where day_end_header_id=?) as A ;
    const decimal_places = req.userIdentity.decimal_places;
    _mysql
      .executeQuery({
        query: `select finance_day_end_sub_detail_id ,payment_date,SD.head_id,
        child_id,concat(account_name,'-->',child_name ) as to_account,  ROUND( debit_amount , ${decimal_places}) as debit_amount,
        case payment_type when 'CR' then 'Credit' else 'Debit' end
         as payment_type, ROUND( credit_amount , ${decimal_places}) as credit_amount
        from finance_day_end_sub_detail SD left join finance_account_head H on SD.head_id=H.finance_account_head_id
        left join finance_account_child C on SD.child_id=C.finance_account_child_id where day_end_header_id=?;`,
        values: [req.query.day_end_header_id],
        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = {
          entries: result
        };
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getAccountHeadsForDropdown: (req, res, next) => {
    const utilities = new algaehUtilities();
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
          finance_account_child_id,child_name,head_id,C.created_from as child_created_from
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id  ${str}
           where (root_id=? or finance_account_head_id=?) order by account_level,sort_order;     `,

          printQuery: false,

          values: [input.finance_account_head_id, input.finance_account_head_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          const outputArray = createHierarchyForDropdown(result);
          req.records = outputArray;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      // let strQry = "";

      // switch (input.voucher_type) {
      //   case "journal":
      //     strQry = ` where account_type  not  in ('B','C') `;
      //     break;

      //   case "contra":
      //     strQry = ` where account_type   in ('B','C') `;
      //     break;
      //   case "sales":
      //     strQry = ` where account_type  not  in ('B','C') `;
      //     break;
      // }

      let selectStr = "";
      let whereStr = "";
      let unionStr = "";

      switch (input.voucher_type) {
        case "journal":
          selectStr = " ,parent_acc_id ";
          whereStr = ` where account_type  not in ('B','C') `;
          unionStr = ` where account_type  not in ('B','C') `;
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
            H.created_from as created_status ,sort_order ${selectStr}
            ,root_id,
            finance_account_child_id,child_name,head_id,C.created_from as child_created_from
            from finance_account_head H left join
            finance_account_child C on C.head_id=H.finance_account_head_id and  finance_account_child_id <> 1 ${whereStr}
           
            union                  
            select H.finance_account_head_id,H.account_code,H.account_name,H.account_parent,H.account_level,
            H.created_from as created_status ,H.sort_order,H.parent_acc_id,H.root_id,
            C.finance_account_child_id,C.child_name,C.head_id,C.created_from as child_created_from
            from finance_account_head H left join
            finance_account_child C on C.head_id=H.finance_account_head_id
            inner join cte on H.parent_acc_id = cte.finance_account_head_id   ${unionStr}
            )
            select * from cte order by account_level,sort_order;`,

          printQuery: false,
          values: []
        })
        .then(result => {
          _mysql.releaseConnection();
          const outputArray = createHierarchyForDropdown(result);
          req.records = outputArray;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },
  //created by irfan:
  getAccountHeadsForDropdown_BKP_24_dec: (req, res, next) => {
    const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 6
    ) {
      _mysql
        .executeQuery({
          query: `with recursive cte (finance_account_head_id,account_code, account_name, parent_acc_id,
              finance_account_child_id,child_name,child_created_from,account_level,sort_order,head_id,created_status,root_id) as (              
              select finance_account_head_id,H.account_code,account_name,parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,account_level,H.sort_order,CM.head_id,H.created_from as created_status,H.root_id
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              where finance_account_head_id=?              
              union                  
              select   H.finance_account_head_id,H.account_code,H.account_name,H.parent_acc_id,
              C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
              ,H.account_level,H.sort_order,CM.head_id,H.created_from as created_status,H.root_id
              FROM finance_account_head H left join 
              finance_head_m_child CM on H.finance_account_head_id=CM.head_id
              left join finance_account_child C on CM.child_id=C.finance_account_child_id
              inner join 
              cte
              on H.parent_acc_id = cte.finance_account_head_id )
              select * from cte order by account_level,sort_order;    `,

          printQuery: false,

          values: [input.finance_account_head_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          const outputArray = createHierarchyForDropdown(result);
          req.records = outputArray;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      _mysql
        .executeQuery({
          query: `	select finance_account_head_id,H.account_code,account_name,parent_acc_id,
        C.finance_account_child_id,C.child_name,CM.created_from as child_created_from
        ,account_level,H.sort_order,CM.head_id,H.created_from as created_status,H.root_id
        FROM finance_account_head H left join 
        finance_head_m_child CM on H.finance_account_head_id=CM.head_id
        left join finance_account_child C on CM.child_id=C.finance_account_child_id;        `,

          printQuery: false,

          values: [input.finance_account_head_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          const outputArray = createHierarchyForDropdown(result);
          req.records = outputArray;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },
  //created by irfan:
  getLedgerDataForChart: (req, res, next) => {
    const utilities = new algaehUtilities();
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
          values: [year, monthArray, input.finance_account_head_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          let outputArray = [];
          if (
            input.finance_account_head_id == 1 ||
            input.finance_account_head_id == 5
          ) {
            outputArray = result.map(m => {
              return {
                ...m,
                amount: m.debit_minus_credit,
                growth_percent: m.dr_growth_percent
              };
            });
          } else {
            outputArray = result.map(m => {
              return {
                ...m,
                amount: m.credit_minus_debit,
                growth_percent: m.cr_growth_percent
              };
            });
          }

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
  renameAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    //. const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leaf_node == "Y") {
      _mysql
        .executeQuery({
          query:
            "select finance_account_child_id,C.created_from,H.root_id,C.head_id from finance_account_child C inner join finance_account_head H \
            on C.head_id=H.finance_account_head_id where finance_account_child_id=?;\
            select finance_voucher_id,debit_amount,credit_amount,payment_type,head_id,H.root_id\
            from finance_voucher_details VD inner join finance_account_head H\
            on VD.head_id=H.finance_account_head_id  where VD.auth_status='A'\
            and VD.is_opening_bal='Y' and VD.child_id=?;\
            select default_branch_id FROM finance_options limit 1;",
          values: [
            input.finance_account_child_id,
            input.finance_account_child_id
          ],
          printQuery: true
        })
        .then(result => {
          let voucherStr = "";
          //if update if opening balance exist
          if (result[1].length > 0) {
            const data = result[1][0];

            if (data.root_id == 1) {
              if (data.debit_amount != input.opening_balance) {
                voucherStr = `update finance_voucher_details set debit_amount=${input.opening_balance} where finance_voucher_id=${data.finance_voucher_id};`;
              }
            } else if (data.root_id == 2 || data.root_id == 3) {
              if (data.credit_amount != input.opening_balance) {
                voucherStr = `update finance_voucher_details set credit_amount=${input.opening_balance} where finance_voucher_id=${data.finance_voucher_id};`;
              }
            }
          }
          //inserting new opening balance
          else {
            let insert_data = result[0][0];

            let debit_amount = 0;
            let credit_amount = 0;
            let payment_type = "CR";
            if (insert_data["root_id"] == 1 && input.opening_balance > 0) {
              debit_amount = input.opening_balance;
              payment_type = "DR";

              voucherStr = _mysql.mysqlQueryFormat(
                "INSERT INTO finance_voucher_details (payment_date,head_id,child_id,debit_amount,credit_amount,\
                      payment_type,hospital_id,year,month,is_opening_bal,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  new Date(),
                  insert_data.head_id,
                  insert_data.finance_account_child_id,
                  debit_amount,
                  credit_amount,
                  payment_type,
                  result[2][0]["default_branch_id"],
                  moment().format("YYYYY"),
                  moment().format("M"),
                  "Y",
                  req.userIdentity.algaeh_d_app_user_id,
                  "A"
                ]
              );
            } else if (
              (insert_data["root_id"] == 2 || insert_data["root_id"] == 3) &&
              input.opening_balance > 0
            ) {
              credit_amount = input.opening_balance;
              voucherStr = _mysql.mysqlQueryFormat(
                "INSERT INTO finance_voucher_details (payment_date,head_id,child_id,debit_amount,credit_amount,\
                    payment_type,hospital_id,year,month,is_opening_bal,entered_by,auth_status)  VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  new Date(),
                  insert_data.head_id,
                  insert_data.finance_account_child_id,
                  debit_amount,
                  credit_amount,
                  payment_type,
                  result[2][0]["default_branch_id"],
                  moment().format("YYYYY"),
                  moment().format("M"),
                  "Y",
                  req.userIdentity.algaeh_d_app_user_id,
                  "A"
                ]
              );
            }
          }

          if (result[0][0]["created_from"] == "U") {
            _mysql
              .executeQuery({
                query: `update finance_account_child set  child_name=?,updated_by=?,updated_date=? where\
                  finance_account_child_id=? and created_from='U'; ${voucherStr};`,
                values: [
                  input.child_name,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  input.finance_account_child_id
                ],
                printQuery: true
              })
              .then(result2 => {
                _mysql.releaseConnection();
                req.records = result2;
                next();
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else if (result[0][0]["created_from"] == "S" && voucherStr != "") {
            _mysql
              .executeQuery({
                query: voucherStr,
                printQuery: true
              })
              .then(result2 => {
                _mysql.releaseConnection();
                req.records = result2;
                next();
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cannot Modify System defined Ledgers"
            };
            next();
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      _mysql
        .executeQuery({
          query:
            "select created_from from finance_account_head where finance_account_head_id=?;",
          values: [input.finance_account_head_id],
          printQuery: true
        })
        .then(result => {
          if (result[0]["created_from"] == "U") {
            _mysql
              .executeQuery({
                query:
                  "update finance_account_head set account_name=?,updated_by=?,updated_date=?\
                 where finance_account_head_id=? and created_from='U';",
                values: [
                  input.account_name,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  input.finance_account_head_id
                ],
                printQuery: false
              })
              .then(result2 => {
                _mysql.releaseConnection();
                req.records = result2;
                next();
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Cannot Modify System defined Ledgers"
            };
            next();
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },
  //created by irfan: to
  getOpeningBalance: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    const decimal_places = req.userIdentity.decimal_places;
    _mysql
      .executeQuery({
        query: `select finance_account_head_id,finance_account_child_id,is_opening_bal,
        ROUND(coalesce(debit_amount ,0),${decimal_places}) as debit_amount,  ROUND(coalesce(credit_amount,0),${decimal_places}) as credit_amount,
      root_id from finance_account_child C inner join 
      finance_account_head H on H.finance_account_head_id=C.head_id and C.finance_account_child_id=?
      left join finance_voucher_details VD  on C.finance_account_child_id=VD.child_id 
      and is_opening_bal='Y' limit 1;`,
        values: [req.query.child_id],
        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();

        if (result.length > 0) {
          if (result[0]["root_id"] == 1) {
            req.records = { opening_bal: result[0]["debit_amount"] };
            next();
          } else if (result[0]["root_id"] == 2 || result[0]["root_id"] == 3) {
            req.records = { opening_bal: result[0]["credit_amount"] };
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "cant edit opening balance for this ledger"
            };
            next();
          }
        } else {
          req.records = {
            invalid_input: true,
            message: "this ledger is not found"
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
          title: item.child_name,
          label: item.child_name,
          head_id: item["head_id"],
          disabled: false,
          leafnode: "Y",
          root_id: root_id,
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
        // for (let k = 0; k < levels_group[i].length; k++) {
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
    console.log("am55:", e);
    reject(e);
  }
}

//created by :IRFAN to build tree hierarchy
function createHierarchyForDropdown(arry) {
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

        child.push({
          finance_account_child_id: item["finance_account_child_id"],

          title: item.child_name,
          label: item.child_name,
          account_code: item["account_code"],
          head_id: item["head_id"],
          root_id: item["root_id"],
          disabled: false,
          leafnode: "Y",
          created_status: item["child_created_from"]
        });

        //if children array doesnt contain this non-leaf node then push
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

//created by irfan:
function getAccountHeadsFunc(decimal_places, finance_account_head_id) {
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
           where root_id=? order by account_level,sort_order;           
           select C.head_id,finance_account_child_id as child_id,child_name,root_id
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
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount
          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A' 
          where H.root_id=?
          group by H.finance_account_head_id  order by account_level;  `,

          values: [
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
