import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";

export default {
  //created by irfan:
  getBalanceSheet: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;

    const { display_column_by, from_date, to_date } = req.query;

    _mysql
      .executeQuery({
        query: ` with recursive cte as (
                select finance_account_head_id,account_code,account_name,       
                parent_acc_id from finance_account_head   where  account_code='1' 
                union                 
                select H.finance_account_head_id,H.account_code,H.account_name,       
                H.parent_acc_id from finance_account_head H  
                inner join cte on H.parent_acc_id = cte.finance_account_head_id  
                )select * from cte ;
                select max(account_level) as account_level from finance_account_head 
                where root_id=1;

                with recursive cte as (
                  select finance_account_head_id,account_code,account_name,       
                  parent_acc_id from finance_account_head   where  account_code='2' 
                  union                 
                  select H.finance_account_head_id,H.account_code,H.account_name,       
                  H.parent_acc_id from finance_account_head H  
                  inner join cte on H.parent_acc_id = cte.finance_account_head_id  
                  )select * from cte ;
                  select max(account_level) as account_level from finance_account_head 
                  where root_id=2;

                  with recursive cte as (
                    select finance_account_head_id,account_code,account_name,       
                    parent_acc_id from finance_account_head   where  account_code='3' 
                    union                 
                    select H.finance_account_head_id,H.account_code,H.account_name,       
                    H.parent_acc_id from finance_account_head H  
                    inner join cte on H.parent_acc_id = cte.finance_account_head_id  
                    )select * from cte ;
                    select max(account_level) as account_level from finance_account_head 
                    where root_id=3; 
                    
                    
                    select finance_account_head_id,account_code, account_name,account_parent,account_level, sort_order,parent_acc_id,root_id,
                    finance_account_child_id,  child_name,head_id from finance_account_head H left join 
                    finance_account_child C on C.head_id=H.finance_account_head_id where root_id=1 order by account_level,sort_order;   

                    select finance_account_head_id,account_code, account_name,account_parent,account_level, sort_order,parent_acc_id,root_id,
                    finance_account_child_id,  child_name,head_id from finance_account_head H left join 
                    finance_account_child C on C.head_id=H.finance_account_head_id where root_id=2 order by account_level,sort_order; 

                    select finance_account_head_id,account_code, account_name,account_parent,account_level, sort_order,parent_acc_id,root_id,
                    finance_account_child_id,  child_name,head_id from finance_account_head H left join 
                    finance_account_child C on C.head_id=H.finance_account_head_id where root_id=3 order by account_level,sort_order; 
                    SELECT cost_center_type,cost_center_required  FROM finance_options limit 1;`,
      })
      .then((result) => {
        const asset_head_ids = result[0].map((m) => m.finance_account_head_id);
        const liability_head_ids = result[2].map(
          (m) => m.finance_account_head_id
        );
        const capital_head_ids = result[4].map(
          (m) => m.finance_account_head_id
        );

        const asset_levels = result[1];
        const liability_levels = result[3];
        const capital_levels = result[5];

        const asset_accounting_heads = result[6];
        const liability_accounting_heads = result[7];
        const capital_accounting_heads = result[8];
        const finance_options = result[9][0];

        let columns = [];
        let dateStart = moment(from_date);
        let dateEnd = moment(to_date);

        let liability_qry = "";
        let asset_qry = "";
        let capital_qry = "";

        if (
          display_column_by == "CC" &&
          finance_options["cost_center_required"] == "Y"
        ) {
          let costCenterQuery = "";
          let costStr = "";

          switch (finance_options["cost_center_type"]) {
            case "P":
              // selectStr = " ,VD.project_id as column_id ";
              costStr = " and VD.project_id= ";
              costCenterQuery = `select hims_d_project_id as column_id ,project_desc  as label   from hims_d_project where pjoject_status='A';
             `;
              break;
            case "SD":
              // selectStr = " ,VD.sub_department_id as column_id ";
              costStr = " and  VD.sub_department_id = ";

              costCenterQuery = `  select hims_d_sub_department_id as column_id ,sub_department_name  as label  from hims_d_sub_department where record_status='A';  `;

              break;
            case "B":
              // selectStr = " ,VD.hospital_id as column_id ";
              costStr = " and VD.hospital_id=  ";
              costCenterQuery = ` select  hims_d_hospital_id as column_id ,hospital_name as label  from hims_d_hospital where record_status='A';`;
          }

          _mysql
            .executeQuery({
              query: costCenterQuery,
              printQuery: true,
            })
            .then((costResult) => {
              columns = costResult;

              let column_len = columns.length;
              for (let i = 0; i < column_len; i++) {
                asset_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
                   ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                   ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                   from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
                   and VD.auth_status='A'   and VD.payment_date <= '${to_date}' ${costStr} ${columns[i]["column_id"]}
                   where H.root_id=1 group by H.finance_account_head_id  order by account_level; 
                 
                 select C.head_id,finance_account_child_id as child_id
                 ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                 ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                 ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                 ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                 from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
                 and VD.payment_date <= '${to_date}' ${costStr} ${columns[i]["column_id"]}
                 where C.head_id in(${asset_head_ids}) group by C.finance_account_child_id;   `;

                liability_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
                 ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                 ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                 from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
                 and VD.auth_status='A'   and VD.payment_date <= '${to_date}' ${costStr} ${columns[i]["column_id"]}
                 where H.root_id=2 group by H.finance_account_head_id  order by account_level; 
                 
                 select C.head_id,finance_account_child_id as child_id
                 ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                 ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                 ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                 ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                 from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
                 and VD.payment_date <= '${to_date}' ${costStr} ${columns[i]["column_id"]}
                 where C.head_id in(${liability_head_ids}) group by C.finance_account_child_id;   `;

                capital_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
                 ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                 ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                 from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
                 and VD.auth_status='A'   and VD.payment_date <= '${to_date}' ${costStr} ${columns[i]["column_id"]}
                 where H.root_id=3 group by H.finance_account_head_id  order by account_level; 
                 
                 select C.head_id,finance_account_child_id as child_id
                 ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                 ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                 ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                 ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                 from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
                 and VD.payment_date <= '${to_date}' ${costStr} ${columns[i]["column_id"]}
                 where C.head_id in(${capital_head_ids}) group by C.finance_account_child_id;   `;
              }

              let data = {
                _mysql,
                columns,
                decimal_places,
                trans_symbol: "Dr",
                qry: asset_qry,
                levels: asset_levels,
                accounting_heads: asset_accounting_heads,
              };
              generateBalanceSheet(data)
                .then((assetResult) => {
                  data["qry"] = liability_qry;
                  data["levels"] = liability_levels;
                  data["trans_symbol"] = "Cr";
                  data["accounting_heads"] = liability_accounting_heads;

                  generateBalanceSheet(data)
                    .then((liablityRsult) => {
                      data["qry"] = capital_qry;
                      data["levels"] = capital_levels;
                      data["accounting_heads"] = capital_accounting_heads;
                      generateBalanceSheet(data)
                        .then((capitalResult) => {
                          _mysql.releaseConnection();

                          liablityRsult.children.push(capitalResult);
                          liablityRsult.label = "Liabilities and Equity";

                          for (let i = 0; i < column_len; i++) {
                            let column_id = columns[i]["column_id"];
                            liablityRsult[column_id] = parseFloat(
                              parseFloat(liablityRsult[column_id]) +
                                parseFloat(capitalResult[column_id])
                            ).toFixed(decimal_places);
                          }

                          req.records = {
                            columns,
                            asset: assetResult,
                            liabilities: liablityRsult,
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
        } else {
          switch (display_column_by) {
            case "M":
              const months_Array = [];
              while (dateEnd >= dateStart) {
                months_Array.push({
                  month_name: dateStart.format("MMM, YYYY"),
                  startOfMonth: moment(dateStart)
                    .startOf("month")
                    .format("YYYY-MM-DD"),
                  endOfMonth: moment(dateStart)
                    .endOf("month")
                    .format("YYYY-MM-DD"),
                  month_id: dateStart.format("YYYYMM"),
                });
                dateStart.add(1, "month");
              }
              const months_len = months_Array.length;

              if (months_len > 1) {
                for (let i = 0; i < months_len; i++) {
                  if (i == months_len - 1) {
                    if (to_date == months_Array[i]["endOfMonth"]) {
                      columns.push({
                        column_id: months_Array[i]["month_id"],
                        label: months_Array[i]["month_name"],
                        cutOff_date: months_Array[i]["endOfMonth"],
                      });
                    } else {
                      columns.push({
                        column_id: months_Array[i]["month_id"],
                        label: moment(to_date).format("D MMM, YYYY"),
                        cutOff_date: to_date,
                      });
                    }
                  } else {
                    columns.push({
                      column_id: months_Array[i]["month_id"],
                      label: months_Array[i]["month_name"],
                      cutOff_date: months_Array[i]["endOfMonth"],
                    });
                  }
                }
              } else if (months_len == 1) {
                columns.push({
                  column_id: months_Array[0]["month_id"],
                  label: moment(to_date).format("D MMM, YYYY"),
                  cutOff_date: to_date,
                });
              }
              break;
            case "Y":
              const years_Array = [];

              while (dateEnd >= dateStart) {
                years_Array.push({
                  startOfYear: moment(dateStart)
                    .startOf("year")
                    .format("YYYY-MM-DD"),
                  endOfYear: moment(dateStart)
                    .endOf("year")
                    .format("YYYY-MM-DD"),
                  year_id: dateStart.format("YYYY"),
                });
                dateStart.add(1, "year");
              }

              const year_len = years_Array.length;
              if (year_len > 1) {
                for (let i = 0; i < year_len; i++) {
                  if (i == year_len - 1) {
                    if (to_date == years_Array[i]["endOfYear"]) {
                      columns.push({
                        column_id: years_Array[i]["year_id"],
                        label: "Jan-Dec " + years_Array[i]["year_id"],
                        cutOff_date: years_Array[i]["endOfYear"],
                      });
                    } else {
                      columns.push({
                        column_id: years_Array[i]["year_id"],
                        label: moment(to_date).format("D MMM, YYYY"),
                        cutOff_date: to_date,
                      });
                    }
                  } else {
                    columns.push({
                      column_id: years_Array[i]["year_id"],
                      label: "Jan-Dec " + years_Array[i]["year_id"],
                      cutOff_date: years_Array[i]["endOfYear"],
                    });
                  }
                }
              } else if (year_len == 1) {
                columns.push({
                  column_id: years_Array[0]["year_id"],
                  label: moment(to_date).format("D MMM, YYYY"),
                  cutOff_date: to_date,
                });
              }

              break;
            default:
              columns.push({
                column_id: "total",
                label: "TOTAL",
                cutOff_date: moment(to_date, "YYYY-MM-DD").format("YYYY-MM-DD"),
              });
          }

          let column_len = columns.length;
          for (let i = 0; i < column_len; i++) {
            asset_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
                          ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                          ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                          from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
                          and VD.auth_status='A'   and VD.payment_date <= '${columns[i]["cutOff_date"]}'
                          where H.root_id=1 group by H.finance_account_head_id  order by account_level; 
                        
                        select C.head_id,finance_account_child_id as child_id
                        ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                        ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                        ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                        ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                        from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
                        and VD.payment_date <= '${columns[i]["cutOff_date"]}'
                        where C.head_id in(${asset_head_ids}) group by C.finance_account_child_id;   `;

            liability_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
                        ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                        ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                        from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
                        and VD.auth_status='A'   and VD.payment_date <= '${columns[i]["cutOff_date"]}'
                        where H.root_id=2 group by H.finance_account_head_id  order by account_level; 
                        
                        select C.head_id,finance_account_child_id as child_id
                        ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                        ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                        ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                        ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                        from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
                        and VD.payment_date <= '${columns[i]["cutOff_date"]}'
                        where C.head_id in(${liability_head_ids}) group by C.finance_account_child_id;   `;

            capital_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
                        ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                        ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
                        from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
                        and VD.auth_status='A'   and VD.payment_date <= '${columns[i]["cutOff_date"]}'
                        where H.root_id=3 group by H.finance_account_head_id  order by account_level; 
                        
                        select C.head_id,finance_account_child_id as child_id
                        ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
                        ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
                        ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
                        ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
                        from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
                        and VD.payment_date <= '${columns[i]["cutOff_date"]}'
                        where C.head_id in(${capital_head_ids}) group by C.finance_account_child_id;   `;
          }

          let data = {
            _mysql,
            columns,
            decimal_places,
            trans_symbol: "Dr",
            qry: asset_qry,
            levels: asset_levels,
            accounting_heads: asset_accounting_heads,
          };
          generateBalanceSheet(data)
            .then((assetResult) => {
              data["qry"] = liability_qry;
              data["levels"] = liability_levels;
              data["trans_symbol"] = "Cr";
              data["accounting_heads"] = liability_accounting_heads;

              generateBalanceSheet(data)
                .then((liablityRsult) => {
                  data["qry"] = capital_qry;
                  data["levels"] = capital_levels;
                  data["accounting_heads"] = capital_accounting_heads;
                  generateBalanceSheet(data)
                    .then((capitalResult) => {
                      _mysql.releaseConnection();

                      liablityRsult.children.push(capitalResult);
                      liablityRsult.label = "Liabilities and Equity";

                      for (let i = 0; i < column_len; i++) {
                        let column_id = columns[i]["column_id"];
                        liablityRsult[column_id] = parseFloat(
                          parseFloat(liablityRsult[column_id]) +
                            parseFloat(capitalResult[column_id])
                        ).toFixed(decimal_places);
                      }

                      req.records = {
                        columns,
                        asset: assetResult,
                        liabilities: liablityRsult,
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
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};

//created by irfan:
function generateBalanceSheet(options) {
  try {
    return new Promise((resolve, reject) => {
      const {
        _mysql,
        columns,
        trans_symbol,
        decimal_places,
        qry,
        levels,
        accounting_heads,
      } = options;

      _mysql
        .executeQuery({
          query: qry,
          printQuery: false,
        })
        .then((result) => {
          const headObj = {};
          const childObj = {};

          let res = 0;

          const column_len = columns.length;

          for (let i = 0; i < column_len; i++) {
            let head_data = calcAmount(result[res], levels, decimal_places);

            let column_id = columns[i]["column_id"];
            headObj[column_id] = head_data;
            childObj[column_id] = result[res + 1];
            res += 2;
          }

          const outputArray = buildHierarchy(
            accounting_heads,
            childObj,
            headObj,
            trans_symbol,
            decimal_places
          );
          resolve(outputArray[0]);
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

//created by :IRFAN to calculate the amount of  head accounts bottom to top levels
function calcAmount(account_heads, levels, decimal_places) {
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
function buildHierarchy(
  arry,
  child_data,
  head_data,
  trans_symbol,
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
            if (trans_symbol == "Dr") {
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

        //END---calulating Amount
        child.push({
          finance_account_child_id: item["finance_account_child_id"],
          trans_symbol: trans_symbol,
          ...columns_wise_amounts,

          label: item.child_name,
          head_id: item["head_id"],

          leafnode: "Y",
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
              if (trans_symbol == "Dr") {
                amount = BALANCE.deb_minus_cred;

                columns_wise_amounts[head] = amount;
              } else {
                amount = BALANCE.cred_minus_deb;

                columns_wise_amounts[head] = amount;
              }
            }
          }

          //END---calulating Amount

          target.push({
            ...item,
            trans_symbol: trans_symbol,
            ...columns_wise_amounts,

            label: item.account_name,

            leafnode: "N",
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
            if (trans_symbol == "Dr") {
              amount = BALANCE.deb_minus_cred;

              columns_wise_amounts[head] = amount;
            } else {
              amount = BALANCE.cred_minus_deb;

              columns_wise_amounts[head] = amount;
            }
          }
        }

        //END---calulating Amount

        target.push({
          ...item,
          trans_symbol: trans_symbol,
          ...columns_wise_amounts,

          label: item.account_name,

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
    console.log("MY-ERORR:", e);
  }
}
