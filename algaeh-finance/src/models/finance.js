import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";

import algaehUtilities from "algaeh-utilities/utilities";
import { resolve } from "dns";

// import mysql from "mysql";
// import { resolve } from "path";
// import { rejects } from "assert";

export default {
  //created by irfan: to mark absent
  getAccountHeadsBKUP: (req, res, next) => {
    const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.query;

    if (
      input.finance_account_head_id > 0 &&
      input.finance_account_head_id < 5
    ) {
      // input["childs_of"] = "A";
      console.log("input:", input);

      let default_total = "0.00 NO TRANS";
      let trans_symbol = "CR";
      if (input.finance_account_head_id == 1) {
        trans_symbol = "DR";
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
              from finance_voucher_details group by child_id; 

              select finance_account_head_id as head_id ,account_code,coalesce(sum(debit_amount) ,0.0000)as debit_amount,
              coalesce(sum(credit_amount) ,0.0000)as credit_amount ,              
              (coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) )as cred_minus_deb,
              (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)) as deb_minus_cred              
              from finance_account_head H left join
              finance_voucher_details VD on H.finance_account_head_id=VD.head_id
              where account_code like'${input.finance_account_head_id}%' group by account_code;
         
              `,

          printQuery: true,

          values: [input.finance_account_head_id]
        })
        .then(result => {
          const child_data = result[1];

          const head_data = result[2];
          _mysql.releaseConnection();

          utilities.logger().log("child_data: ", child_data);

          const outputArray = createHierarchy(
            result[0],
            child_data,
            head_data,
            trans_symbol,
            default_total
          );

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
  //created by irfan: to mark absent
  getAccountHeads: (req, res, next) => {
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
        console.log("AM HHHH");
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
              from finance_voucher_details group by head_id,child_id; 
                  
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

  //created by irfan: to
  addAccountHeads: (req, res, next) => {
    const _mysql = new algaehMysql();
    //. const utilities = new algaehUtilities();
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
                  "INSERT INTO `finance_head_m_child` (head_id,child_id,created_from)  VALUE(?,?,?);",
                values: [input.finance_account_head_id, result.insertId, "U"],
                printQuery: true
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
                        payment_type,credit_amount,narration,enteredby,entered_date)  VALUE(?,?,?,?,?,?,?,?,?,?);",
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
                      printQuery: true
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
      strQry += `update finance_accounts_maping set child_id=${item.child_id},head_id=${item.head_id},
      head_account_code=(select account_code from finance_account_head where finance_account_head_id =${item.head_id} limit 1)
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

    if (
      moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
      moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
    ) {
      strQry += ` and H.transaction_date between date('${input.from_date}') and  date('${input.to_date}') `;
    }

    if (input.document_number !== undefined && input.document_number == null) {
      strQry += ` and  H.document_number='${input.document_number}'`;
    }
    if (
      input.transaction_type !== undefined &&
      input.transaction_type == null
    ) {
      strQry += ` and H.transaction_type='${input.transaction_type}'`;
    }

    // `select SD.finance_day_end_sub_detail_id,D.finance_day_end_detail_id ,H.transaction_date,case D.payment_mode when 'CA' then\
    // 'CASH' when 'CH' then 'CHEQUE' when 'CD' then 'CARD'  end as payment_mode ,D.amount,SD.narration,\
    // H.document_type,H.document_number,case H.transaction_type when 'AD' then 'ADVANCE' \
    // when 'RF' then 'REFUND' end as transaction_type ,S.screen_name from finance_day_end_header H inner join\
    // finance_day_end_detail D on H.finance_day_end_header_id=D.day_end_header_id \
    // inner join finance_day_end_sub_detail SD on D.finance_day_end_detail_id=SD.day_end_detail_id\
    // left join  algaeh_d_app_screens S on H.from_screen=S.screen_code\
    // where  SD.posted='N'  ${strQry}  group by finance_day_end_detail_id;`

    _mysql
      .executeQuery({
        query: ` select finance_day_end_header_id,transaction_date,amount,control_account,document_type,
        document_number,from_screen,case H.transaction_type when 'AD' then 'ADVANCE' 
        when 'RF' then 'REFUND' when 'BILL' then 'OPBILL' when  'CREDIT' then 
        'PATIENT CREDIT'  when  'ADJUST' then 'ADVANCE ADJUST'  when 'CREDIT_ST' then 'CREDIT SETTLEMENT'
        when 'OP_BIL_CAN' then 'OP BILL CANCEL'
        end as transaction_type,S.screen_name,H.narration 
        from finance_day_end_header H inner join finance_day_end_sub_detail SD on
         H.finance_day_end_header_id=SD.day_end_header_id
        left join  algaeh_d_app_screens S on H.from_screen=S.screen_code  where  SD.posted='N'  ${strQry}
        group by  finance_day_end_header_id; `,

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

    // WITH cte_  AS (
    //   SELECT finance_day_end_sub_detail_id, day_end_header_id, payment_date, head_account_code,
    //   case when sum(debit_amount)= sum(credit_amount)then 'true' when transaction_type='ADJUST' then true
    //   when transaction_type='CREDIT_ST' then 'true' else 'false'  end as is_equal,transaction_type FROM finance_day_end_header H inner join
    //   finance_day_end_sub_detail SD on H.finance_day_end_header_id=day_end_header_id
    //   where H.posted='N' and day_end_header_id in (?)
    //   group by day_end_header_id)
    //   select finance_day_end_sub_detail_id,day_end_header_id,payment_date,head_account_code,
    //   head_id,child_id,debit_amount,payment_type,credit_amount,narration,hospital_id
    //   from finance_day_end_sub_detail where day_end_header_id in (SELECT day_end_header_id
    //   FROM cte_ where is_equal='true');

    _mysql
      .executeQuery({
        query: `  select finance_day_end_sub_detail_id,day_end_header_id,payment_date,head_account_code,
        head_id,child_id,debit_amount,payment_type,credit_amount,narration,year,month,hospital_id 
        from finance_day_end_sub_detail where day_end_header_id in (?);`,
        values: [input.finance_day_end_header_ids],
        printQuery: true
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();
        if (result.length > 0) {
          const updateFinanceDayEndDetailIds = result.map(m => {
            return m.finance_day_end_sub_detail_id;
          });
          console.log(
            "updateFinanceDayEndDetailIds:",
            updateFinanceDayEndDetailIds
          );
          const insertColumns = [
            "payment_date",
            "day_end_header_id",
            "head_account_code",
            "head_id",
            "child_id",
            "debit_amount",
            "credit_amount",
            "payment_type",
            "narration",
            "hospital_id",
            "year",
            "month"
          ];
          _mysql
            .executeQueryWithTransaction({
              query: "insert into finance_voucher_details (??) values ?;",
              values: result,
              includeValues: insertColumns,
              bulkInsertOrUpdate: true,
              printQuery: true
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
  },
  //created by irfan: to
  removeAccountHead: (req, res, next) => {
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
          printQuery: true
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
                  printQuery: true
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
                  printQuery: true
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
  testBKUP: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.body;

    _mysql
      .executeQuery({
        query: `select finance_account_head_id,account_code,coalesce(parent_acc_id,'root') as parent_acc_id ,head_account_code,account_name ,account_level,finance_voucher_id,
        coalesce(sum(debit_amount),0.0000)as debit_amount,coalesce(sum(credit_amount),0.000)as credit_amount
        from finance_account_head  H left join finance_voucher_details VD
        on H.finance_account_head_id=VD.head_id        
        where account_code like'1%' group by finance_account_head_id order by account_level;`,
        values: [],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        let children = _.chain(result)
          .groupBy(g => g.parent_acc_id)
          .value();
        // utilities.logger().log("children: ", children);

        let roots = children["root"];

        // // function to recursively build the tree
        let findChildren = function(parent) {
          if (children[parent.finance_account_head_id]) {
            const tempchilds = children[parent.finance_account_head_id];

            parent.children = tempchilds;
            //-----------------

            console.log("children:", children[parent.finance_account_head_id]);

            let new_debit_amount =
              _.sumBy(children[parent.finance_account_head_id], s =>
                parseFloat(s.debit_amount)
              ) + parseFloat(parent["debit_amount"]);
            console.log("new_debit_amount:", new_debit_amount);

            parent["new_debit_amount"] = new_debit_amount;
            //-----------------

            for (let i = 0, len = parent.children.length; i < len; ++i) {
              findChildren(parent.children[i]);
            }
          } else {
            parent["new_debit_amount"] = parent["debit_amount"];
          }
        };

        // enumerate through to handle the case where there are multiple roots
        for (let i = 0, len = roots.length; i < len; ++i) {
          findChildren(roots[i]);
        }

        //let val = initialize(roots[0], children);

        req.records = roots;

        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to
  previewDayEndEntries: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    _mysql
      .executeQuery({
        query: `select finance_day_end_sub_detail_id ,payment_date,head_id,head_account_code,
        child_id,concat(account_name,'-->',child_name ) as to_account,debit_amount,
        case payment_type when 'CR' then 'Credit' else 'Debit' end
         as payment_type,credit_amount,narration
        from finance_day_end_sub_detail SD left join finance_account_head H on SD.head_id=H.finance_account_head_id
        left join finance_account_child C on SD.child_id=C.finance_account_child_id where day_end_header_id=?;
        select coalesce(sum(cash),0)as cash,coalesce(sum(card),0)as card,coalesce(sum(cheque),0)as cheque
        from (select  case when payment_mode = "CA" then amount end as cash,
        case when payment_mode = "CD" then amount end as card,
        case when payment_mode = "CH" then amount end as cheque
        from finance_day_end_detail where day_end_header_id=?) as A ;`,
        values: [req.query.day_end_header_id, req.query.day_end_header_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = {
          ...result[1][0],
          entries: result[0]
        };
        next();
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

// select H.account_code,M.head_id,	M.child_id,coalesce(sum(debit_amount) ,0.0000) as debit_amount,
// coalesce(sum(credit_amount) ,0.0000) as credit_amount,
// (coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) )as cred_minus_deb,
// (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)) as deb_minus_cred
// from finance_head_m_child M inner join
// finance_account_head H on M.head_id=H.finance_account_head_id
// left join finance_voucher_details VD on H.finance_account_head_id=VD.head_id
// group by M.head_id,M.child_id;

// with recursive cte  as (select finance_account_head_id,account_level
//   FROM finance_account_head where finance_account_head_id=2
//   union
//   select H.finance_account_head_id,H.account_level FROM finance_account_head H
//   inner join cte on H.parent_acc_id = cte.finance_account_head_id
//   )
//   select max(account_level)from cte ;

// select finance_account_head_id,account_code,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,
// coalesce(sum(debit_amount),0.0000)as debit_amount,coalesce(sum(credit_amount),0.000)as credit_amount
// from finance_account_head  H left join finance_voucher_details VD on H.finance_account_head_id=VD.head_id
// where finance_account_head_id
// in ( with recursive cte  as (
// select  finance_account_head_id
// from finance_account_head where finance_account_head_id=1
// union
// select H.finance_account_head_id
// from finance_account_head  H inner join cte
// on H.parent_acc_id = cte.finance_account_head_id
// )select * from cte)
// group by finance_account_head_id order by account_level;
