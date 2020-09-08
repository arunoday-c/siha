import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";

export default {
  //created by irfan:
  getProfitAndLoss: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;

    // const input = req.query;

    const { display_column_by, from_date, to_date } = req.query;

    //  const default_total = parseFloat(0).toFixed(decimal_places);
    // let trans_symbol = "Cr.";

    _mysql
      .executeQuery({
        query: ` with recursive cte as (
          select finance_account_head_id,account_code,account_name,       
          parent_acc_id from finance_account_head   where root_id=4
          union select H.finance_account_head_id,H.account_code,H.account_name,       
          H.parent_acc_id from finance_account_head H  
          inner join cte on H.parent_acc_id = cte.finance_account_head_id  
          )select * from cte ; with recursive cte as (
          select finance_account_head_id,account_code,account_name,       
          parent_acc_id from finance_account_head   where root_id=5 and  account_code='5.1' 
          union select H.finance_account_head_id,H.account_code,H.account_name,       
          H.parent_acc_id from finance_account_head H  
          inner join cte on H.parent_acc_id = cte.finance_account_head_id  
          )select * from cte ; with recursive cte as (
        select finance_account_head_id,account_code,account_name,       
        parent_acc_id from finance_account_head   where root_id=5 and  account_code<>'5.1' 
        union select H.finance_account_head_id,H.account_code,H.account_name,       
        H.parent_acc_id from finance_account_head H  
        inner join cte on H.parent_acc_id = cte.finance_account_head_id  and H.account_code<>'5.1'
        )select * from cte ;  SELECT cost_center_type,cost_center_required,report_dill_down_level  FROM finance_options limit 1; 
        
        `,
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

        const finance_options = result[3][0];

        let columns = [];
        let dateStart = moment(from_date);
        let dateEnd = moment(to_date);

        let income_qry = `select finance_account_head_id,account_code,account_name,account_parent,account_level,sort_order,parent_acc_id,root_id,H.is_cos_account,  
        finance_account_child_id, child_name,head_id from finance_account_head H left join finance_account_child C on
        C.head_id=H.finance_account_head_id where H.finance_account_head_id in (${income_head_ids}) order by account_level,sort_order;         
        select max(account_level) as account_level from finance_account_head 
        where  finance_account_head_id in (${income_head_ids});`;
        let direct_expense_qry = `select finance_account_head_id,account_code,account_name,account_parent,account_level,sort_order,parent_acc_id,root_id,H.is_cos_account,  
        finance_account_child_id, child_name,head_id from finance_account_head H left join finance_account_child C on
        C.head_id=H.finance_account_head_id where H.finance_account_head_id in (${direct_expense_head_ids}) order by account_level,sort_order;        
        select max(account_level) as account_level from finance_account_head 
        where  finance_account_head_id in (${direct_expense_head_ids});`;

        let indirect_expense_qry = `select finance_account_head_id,account_code,account_name,account_parent,account_level,sort_order,parent_acc_id,root_id,H.is_cos_account,  
        finance_account_child_id, child_name,head_id from finance_account_head H left join finance_account_child C on
        C.head_id=H.finance_account_head_id where H.finance_account_head_id in (${indirect_expense_head_ids}) order by account_level,sort_order;        
        select max(account_level) as account_level from finance_account_head 
        where  finance_account_head_id in (${indirect_expense_head_ids}) ;`;

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
                income_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,H.is_cos_account,
           ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
           ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
           from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
           and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}') ${costStr} ${columns[i]["column_id"]}
           where H.finance_account_head_id in(${income_head_ids}) group by H.finance_account_head_id  order by account_level; 
         
         select C.head_id,finance_account_child_id as child_id
         ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
         ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
         ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
         ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
         from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
         and  VD.payment_date between date('${from_date}') and date('${to_date}') ${costStr} ${columns[i]["column_id"]}
         where C.head_id in(${income_head_ids}) group by C.finance_account_child_id;   `;

                direct_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,H.is_cos_account,
         ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
         ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
         from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
         and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}') ${costStr} ${columns[i]["column_id"]}
         where  H.finance_account_head_id in(${direct_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
         
         select C.head_id,finance_account_child_id as child_id
         ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
         ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
         ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
         ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
         from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
         and VD.payment_date between date('${from_date}') and date('${to_date}') ${costStr} ${columns[i]["column_id"]}
         where C.head_id in(${direct_expense_head_ids}) group by C.finance_account_child_id;   `;

                indirect_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,H.is_cos_account,
         ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
         ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
         from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
         and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}') ${costStr} ${columns[i]["column_id"]}
         where  H.finance_account_head_id in(${indirect_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
         
         select C.head_id,finance_account_child_id as child_id
         ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
         ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
         ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
         ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
         from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
         and VD.payment_date between date('${from_date}') and date('${to_date}') ${costStr} ${columns[i]["column_id"]}
         where C.head_id in(${indirect_expense_head_ids}) group by C.finance_account_child_id;   `;
              }

              columns.push({
                column_id: "total",
                label: "total",
              });

              income_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,H.is_cos_account,
              ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
              ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
              from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
              and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
              where H.finance_account_head_id in(${income_head_ids}) group by H.finance_account_head_id  order by account_level; 
            
            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and  VD.payment_date between date('${from_date}') and date('${to_date}')  
            where C.head_id in(${income_head_ids}) group by C.finance_account_child_id;   `;

              direct_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,H.is_cos_account,
            ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where  H.finance_account_head_id in(${direct_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
            
            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and VD.payment_date between date('${from_date}') and date('${to_date}') 
            where C.head_id in(${direct_expense_head_ids}) group by C.finance_account_child_id;   `;

              indirect_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level,H.is_cos_account,
            ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where  H.finance_account_head_id in(${indirect_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
            
            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where C.head_id in(${indirect_expense_head_ids}) group by C.finance_account_child_id;   `;
              const drillDownLevel = finance_options.report_dill_down_level;
              let data = {
                _mysql,
                columns,
                decimal_places,
                trans_symbol: "Cr",
                qry: income_qry,
                drillDownLevel,
              };
              generateProfitAndLoss(data)
                .then((incomeOutputArray) => {
                  data["qry"] = direct_expense_qry;
                  data["trans_symbol"] = "Dr";
                  const incomeResult = incomeOutputArray["outputArray"];
                  const maxLevel =
                    incomeOutputArray["max_level"][0]["account_level"];
                  generateProfitAndLoss(data)
                    .then((directArrayOutputArray) => {
                      data["qry"] = indirect_expense_qry;
                      const directResult =
                        directArrayOutputArray["outputArray"];
                      const maxLevel =
                        directArrayOutputArray["max_level"][0]["account_level"];
                      generateProfitAndLoss(data)
                        .then((inDirectArrayOutputArray) => {
                          _mysql.releaseConnection();
                          const indirectResult =
                            inDirectArrayOutputArray["outputArray"];
                          const maxLevel =
                            inDirectArrayOutputArray["max_level"][0][
                              "account_level"
                            ];
                          //-----------------------------------------------

                          let gross_profit = {};
                          for (let i = 0; i <= column_len; i++) {
                            let column_id = columns[i]["column_id"];

                            gross_profit[column_id] = (
                              parseFloat(incomeResult[0][column_id]) -
                              parseFloat(directResult[0][column_id])
                            ).toFixed(decimal_places);
                          }

                          let net_profit = {};

                          for (let i = 0; i <= column_len; i++) {
                            let column_id = columns[i]["column_id"];

                            net_profit[column_id] = (
                              parseFloat(gross_profit[column_id]) -
                              parseFloat(indirectResult[0][column_id])
                            ).toFixed(decimal_places);
                          }

                          //   net_profit["1"] = (
                          //     parseFloat(gross_profit["1"]) -
                          //     parseFloat(IndirectRes[0]["1"])
                          //   ).toFixed(decimal_places);

                          //   net_profit["2"] = (
                          //     parseFloat(gross_profit["2"]) -
                          //     parseFloat(IndirectRes[0]["2"])
                          //   ).toFixed(decimal_places);
                          //------------------------------------------------------------------------

                          let cosResult = [
                            { label: "Cost of Sales", total: 0, children: [] },
                          ];
                          console.log("indirectResult", indirectResult);
                          let directExpeneseResult = [];

                          // indirectResult.forEach((item) => {
                          //   if (item.children) {
                          //     const allNonCOS = item.children.filter(
                          //       (f) => f.is_cos_account !== "Y"
                          //     );
                          //     for (let x = 0; x < allNonCOS.length; x++)
                          //       directResult[0]["children"].push(allNonCOS[x]);
                          //     const allCOS = item.children.filter(
                          //       (f) => f.is_cos_account === "Y"
                          //     );
                          //     const { children, ...rest } = item;
                          //     cosResult.push({
                          //       ...rest,
                          //       label: "Cost Of Salse",
                          //       total: _.sumBy(allCOS, (s) =>
                          //         parseFloat(s.total)
                          //       ),
                          //       children: allCOS,
                          //     });
                          //   }
                          // });
                          directResult.forEach((item) => {
                            if (item.children) {
                              const allNonCOS = item.children.filter(
                                (f) => f.is_cos_account !== "Y"
                              );
                              const allCOS = item.children.filter(
                                (f) => f.is_cos_account === "Y"
                              );
                              if (allCOS.length > 0) {
                                const tot = _.sumBy(allCOS, (s) =>
                                  parseFloat(s.total)
                                );
                                item["total"] = parseFloat(
                                  parseFloat(item["total"]) - parseFloat(tot)
                                ).toFixed(decimal_places);
                                //const { children, ...rest } = item;
                                cosResult[0]["total"] = parseFloat(
                                  parseFloat(cosResult[0]["total"]) +
                                    parseFloat(tot)
                                ).toFixed(decimal_places);
                                for (let i = 0; i < allCOS.length; i++)
                                  cosResult[0]["children"].push(allCOS[i]);
                              }
                              if (allNonCOS.length > 0) {
                                directExpeneseResult.push({
                                  ...item,
                                  children: allNonCOS,
                                });
                              }
                            }
                          });
                          indirectResult.forEach((item) => {
                            if (item.children) {
                              const allNonCOS = item.children.filter(
                                (f) => f.is_cos_account !== "Y"
                              );
                              const allCOS = item.children.filter(
                                (f) => f.is_cos_account === "Y"
                              );
                              if (allCOS.length > 0) {
                                const tot = _.sumBy(allCOS, (s) =>
                                  parseFloat(s.total)
                                );
                                item["total"] = item["total"] - tot;
                                //const { children, ...rest } = item;
                                cosResult[0]["total"] =
                                  cosResult[0]["total"] + tot;
                                for (let i = 0; i < allCOS.length; i++)
                                  cosResult[0]["children"].push(allCOS[i]);
                              }
                              if (allNonCOS.length > 0) {
                                directExpeneseResult[0]["total"] = parseFloat(
                                  parseFloat(directExpeneseResult[0]["total"]) +
                                    _.sumBy(allNonCOS, (s) =>
                                      parseFloat(s.total)
                                    )
                                ).toFixed(decimal_places);
                                for (let x = 0; x < allNonCOS.length; x++)
                                  directExpeneseResult[0]["children"].push(
                                    allNonCOS[x]
                                  );
                              }
                            }
                          });
                          let g_prop = {};
                          if (cosResult.length > 0) {
                            Object.keys(gross_profit).forEach((item) => {
                              g_prop[item] = parseFloat(
                                parseFloat(incomeResult[0][item]) -
                                  parseFloat(cosResult[0][item])
                              ).toFixed(decimal_places);
                            });
                          }

                          let g_propit = [];
                          g_propit.push({
                            account_name: "Gross Profit",
                            label: "Gross Profit",
                            rowClass: "bordering",
                            ...g_prop,
                          });
                          req.records = {
                            columns,
                            income: incomeResult,
                            Direct_expense: directExpeneseResult,
                            Indirect_expense: cosResult,
                            gross_profit: g_propit,
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
                  if (i == 0) {
                    if (from_date == months_Array[i]["startOfMonth"]) {
                      columns.push({
                        column_id: months_Array[i]["month_id"],
                        label: months_Array[i]["month_name"],

                        from_date_pl: months_Array[i]["startOfMonth"],
                        to_date_pl: months_Array[i]["endOfMonth"],
                      });
                    } else {
                      let f_str =
                        moment(from_date).format("D") +
                        "-" +
                        moment(months_Array[i]["endOfMonth"]).format("D");
                      columns.push({
                        column_id: months_Array[i]["month_id"],
                        label: f_str + " " + months_Array[i]["month_name"],
                        from_date_pl: from_date,
                        to_date_pl: months_Array[i]["endOfMonth"],
                      });
                    }
                  } else if (i == months_len - 1) {
                    if (to_date == months_Array[i]["endOfMonth"]) {
                      columns.push({
                        column_id: months_Array[i]["month_id"],
                        label: months_Array[i]["month_name"],
                        from_date_pl: months_Array[i]["startOfMonth"],
                        to_date_pl: months_Array[i]["endOfMonth"],
                      });
                    } else {
                      let t_str =
                        moment(months_Array[i]["startOfMonth"]).format("D") +
                        "-" +
                        moment(to_date).format("D");
                      columns.push({
                        column_id: months_Array[i]["month_id"],
                        label: t_str + " " + months_Array[i]["month_name"],
                        from_date_pl: months_Array[i]["startOfMonth"],
                        to_date_pl: to_date,
                      });
                    }
                  } else {
                    columns.push({
                      column_id: months_Array[i]["month_id"],
                      label: months_Array[i]["month_name"],
                      from_date_pl: months_Array[i]["startOfMonth"],
                      to_date_pl: months_Array[i]["endOfMonth"],
                    });
                  }
                }
              } else if (months_len == 1) {
                let _str =
                  moment(from_date).format("D") +
                  "-" +
                  moment(to_date).format("D");
                columns.push({
                  column_id: months_Array[0]["month_id"],
                  label: _str + " " + months_Array[0]["month_name"],
                  from_date_pl: from_date,
                  to_date_pl: to_date,
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
                  if (i == 0) {
                    if (from_date == years_Array[i]["startOfYear"]) {
                      columns.push({
                        column_id: years_Array[i]["year_id"],
                        label: "Jan-Dec " + years_Array[i]["year_id"],
                        from_date_pl: years_Array[i]["startOfYear"],
                        to_date_pl: years_Array[i]["endOfYear"],
                      });
                    } else {
                      let f_str =
                        moment(from_date).format("D MMM") +
                        "-" +
                        moment(years_Array[i]["endOfYear"]).format(
                          "D MMM, YYYY"
                        );

                      columns.push({
                        column_id: years_Array[i]["year_id"],
                        label: f_str,
                        from_date_pl: from_date,
                        to_date_pl: years_Array[i]["endOfYear"],
                      });
                    }
                  } else if (i == year_len - 1) {
                    if (to_date == years_Array[i]["endOfYear"]) {
                      columns.push({
                        column_id: years_Array[i]["year_id"],
                        label: "Jan-Dec " + years_Array[i]["year_id"],
                        from_date_pl: years_Array[i]["startOfYear"],
                        to_date_pl: years_Array[i]["endOfYear"],
                      });
                    } else {
                      let t_str =
                        moment(years_Array[i]["startOfYear"]).format("D MMM") +
                        "-" +
                        moment(to_date).format("D MMM, YYYY");

                      columns.push({
                        column_id: years_Array[i]["year_id"],
                        label: t_str,
                        from_date_pl: years_Array[i]["startOfYear"],
                        to_date_pl: to_date,
                      });
                    }
                  } else {
                    columns.push({
                      column_id: years_Array[i]["year_id"],
                      label: "Jan-Dec " + years_Array[i]["year_id"],
                      from_date_pl: years_Array[i]["startOfYear"],
                      to_date_pl: years_Array[i]["endOfYear"],
                    });
                  }
                }
              } else if (year_len == 1) {
                let _str = "";

                if (
                  moment(from_date).format("YYYYMMDD") ==
                  moment(to_date).format("YYYYMMDD")
                ) {
                  _str = moment(from_date).format("D MMM, YYYY");
                } else if (
                  moment(from_date).format("MM") == moment(to_date).format("MM")
                ) {
                  _str =
                    moment(from_date).format("D") +
                    "-" +
                    moment(to_date).format("D MMM, YYYY");
                } else {
                  _str =
                    moment(from_date).format("D MMM") +
                    "-" +
                    moment(to_date).format("D MMM, YYYY");
                }
                columns.push({
                  column_id: years_Array[0]["year_id"],
                  label: _str,
                  from_date_pl: from_date,
                  to_date_pl: to_date,
                });
              }
              break;
            default:
              columns.push({
                column_id: "total",
                label: "TOTAL",
              });
          }

          let column_len = columns.length;

          if (display_column_by == "T") {
            income_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where H.finance_account_head_id in(${income_head_ids}) group by H.finance_account_head_id  order by account_level; 

            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and  VD.payment_date between date('${from_date}') and date('${to_date}')  
            where C.head_id in(${income_head_ids}) group by C.finance_account_child_id;   `;

            direct_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where  H.finance_account_head_id in(${direct_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 

            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and VD.payment_date between date('${from_date}') and date('${to_date}') 
            where C.head_id in(${direct_expense_head_ids}) group by C.finance_account_child_id;   `;

            indirect_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where  H.finance_account_head_id in(${indirect_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 

            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where C.head_id in(${indirect_expense_head_ids}) group by C.finance_account_child_id;   `;
          } else {
            for (let i = 0; i < column_len; i++) {
              income_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${columns[i]["from_date_pl"]}') and date('${columns[i]["to_date_pl"]}')  
            where H.finance_account_head_id in(${income_head_ids}) group by H.finance_account_head_id  order by account_level; 
            
            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and  VD.payment_date between date('${columns[i]["from_date_pl"]}') and date('${columns[i]["to_date_pl"]}')  
            where C.head_id in(${income_head_ids}) group by C.finance_account_child_id;   `;

              direct_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${columns[i]["from_date_pl"]}') and date('${columns[i]["to_date_pl"]}')  
            where  H.finance_account_head_id in(${direct_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
            
            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and VD.payment_date between date('${columns[i]["from_date_pl"]}') and date('${columns[i]["to_date_pl"]}')  
            where C.head_id in(${direct_expense_head_ids}) group by C.finance_account_child_id;   `;

              indirect_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${columns[i]["from_date_pl"]}') and date('${columns[i]["to_date_pl"]}')  
            where  H.finance_account_head_id in(${indirect_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
            
            select C.head_id,finance_account_child_id as child_id
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
            ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
            ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
            from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
            and VD.payment_date between date('${columns[i]["from_date_pl"]}') and date('${columns[i]["to_date_pl"]}')  
            where C.head_id in(${indirect_expense_head_ids}) group by C.finance_account_child_id;   `;
            }

            columns.push({
              column_id: "total",
              label: "total",
            });

            income_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
            ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
            ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
            from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
            and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
            where H.finance_account_head_id in(${income_head_ids}) group by H.finance_account_head_id  order by account_level; 
          
          select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
          ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
          from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
          and  VD.payment_date between date('${from_date}') and date('${to_date}')  
          where C.head_id in(${income_head_ids}) group by C.finance_account_child_id;   `;

            direct_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
          from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
          and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
          where  H.finance_account_head_id in(${direct_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
          
          select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
          ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
          from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
          and VD.payment_date between date('${from_date}') and date('${to_date}') 
          where C.head_id in(${direct_expense_head_ids}) group by C.finance_account_child_id;   `;

            indirect_expense_qry += ` select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount
          from finance_account_head H  left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  
          and VD.auth_status='A'   and VD.payment_date between date('${from_date}') and date('${to_date}')  
          where  H.finance_account_head_id in(${indirect_expense_head_ids})  group by H.finance_account_head_id  order by account_level; 
          
          select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0),${decimal_places})  as credit_amount, 
          ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0)- coalesce(sum(credit_amount) ,0)),${decimal_places})  as deb_minus_cred
          from  finance_account_child C  left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' 
          and VD.payment_date between date('${from_date}') and date('${to_date}')  
          where C.head_id in(${indirect_expense_head_ids}) group by C.finance_account_child_id;   `;
          }
          const drillDownLevel = finance_options.report_dill_down_level;
          let data = {
            _mysql,
            columns,
            decimal_places,
            trans_symbol: "Cr",
            qry: income_qry,
            drillDownLevel,
          };
          generateProfitAndLoss(data)
            .then((incomeOutputArray) => {
              //  console.log("INCOME QRY FINISH SUCsESS");
              data["qry"] = direct_expense_qry;
              data["trans_symbol"] = "Dr";
              const incomeResult = incomeOutputArray["outputArray"];
              const maxLevel =
                incomeOutputArray["max_level"][0]["account_level"];
              generateProfitAndLoss(data)
                .then((directArrayOutputArray) => {
                  //console.log("DIRECT QRY FINISH SUCsESS");
                  data["qry"] = indirect_expense_qry;
                  const directResult = directArrayOutputArray["outputArray"];
                  const maxLevel =
                    directArrayOutputArray["max_level"][0]["account_level"];
                  generateProfitAndLoss(data)
                    .then((inDirectArrayOutputArray) => {
                      //console.log("INDIRECT QRY FINISH SUCsESS");
                      _mysql.releaseConnection();
                      const indirectResult =
                        inDirectArrayOutputArray["outputArray"];
                      const maxLevel =
                        inDirectArrayOutputArray["max_level"][0][
                          "account_level"
                        ];
                      //-----------------------------------------------

                      let gross_profit = {};
                      let net_profit = {};
                      // let column_len = columns.length;

                      if (display_column_by == "T") {
                        let column_id = columns[0]["column_id"];

                        gross_profit[column_id] = (
                          parseFloat(incomeResult[0][column_id]) -
                          parseFloat(directResult[0][column_id])
                        ).toFixed(decimal_places);

                        net_profit[column_id] = (
                          parseFloat(gross_profit[column_id]) -
                          parseFloat(indirectResult[0][column_id])
                        ).toFixed(decimal_places);
                      } else {
                        for (let i = 0; i <= column_len; i++) {
                          let column_id = columns[i]["column_id"];

                          gross_profit[column_id] = (
                            parseFloat(incomeResult[0][column_id]) -
                            parseFloat(directResult[0][column_id])
                          ).toFixed(decimal_places);
                        }

                        for (let i = 0; i <= column_len; i++) {
                          let column_id = columns[i]["column_id"];

                          net_profit[column_id] = (
                            parseFloat(gross_profit[column_id]) -
                            parseFloat(indirectResult[0][column_id])
                          ).toFixed(decimal_places);
                        }
                      }

                      //   net_profit["1"] = (
                      //     parseFloat(gross_profit["1"]) -
                      //     parseFloat(IndirectRes[0]["1"])
                      //   ).toFixed(decimal_places);

                      //   net_profit["2"] = (
                      //     parseFloat(gross_profit["2"]) -
                      //     parseFloat(IndirectRes[0]["2"])
                      //   ).toFixed(decimal_places);
                      //------------------------------------------------------------------------
                      let cosResult = [
                        { label: "Cost of Sales", total: 0, children: [] },
                      ];
                      let directExpeneseResult = [];

                      directResult.forEach((item) => {
                        if (item.children) {
                          const allNonCOS = item.children.filter(
                            (f) => f.is_cos_account !== "Y"
                          );
                          const allCOS = item.children.filter(
                            (f) => f.is_cos_account === "Y"
                          );
                          if (allCOS.length > 0) {
                            const tot = _.sumBy(allCOS, (s) =>
                              parseFloat(s.total)
                            );
                            item["total"] = parseFloat(
                              parseFloat(item["total"]) - parseFloat(tot)
                            ).toFixed(decimal_places);
                            //const { children, ...rest } = item;
                            cosResult[0]["total"] = parseFloat(
                              parseFloat(cosResult[0]["total"]) +
                                parseFloat(tot)
                            ).toFixed(decimal_places);
                            for (let i = 0; i < allCOS.length; i++)
                              cosResult[0]["children"].push(allCOS[i]);
                          }
                          if (allNonCOS.length > 0) {
                            directExpeneseResult.push({
                              ...item,
                              children: allNonCOS,
                            });
                          }
                        }
                      });

                      indirectResult.forEach((item) => {
                        if (item.children) {
                          const allNonCOS = item.children.filter(
                            (f) => f.is_cos_account !== "Y"
                          );
                          const allCOS = item.children.filter(
                            (f) => f.is_cos_account === "Y"
                          );
                          if (allCOS.length > 0) {
                            const tot = _.sumBy(allCOS, (s) =>
                              parseFloat(s.total)
                            );
                            item["total"] = item["total"] - tot;
                            //const { children, ...rest } = item;
                            cosResult[0]["total"] = cosResult[0]["total"] + tot;
                            for (let i = 0; i < allCOS.length; i++)
                              cosResult[0]["children"].push(allCOS[i]);
                          }
                          if (allNonCOS.length > 0) {
                            directExpeneseResult[0]["total"] = parseFloat(
                              parseFloat(directExpeneseResult[0]["total"]) +
                                _.sumBy(allNonCOS, (s) => parseFloat(s.total))
                            ).toFixed(decimal_places);
                            for (let x = 0; x < allNonCOS.length; x++)
                              directExpeneseResult[0]["children"].push(
                                allNonCOS[x]
                              );
                          }
                        }
                      });
                      let g_prop = {};
                      let cosExpenseResult = [];
                      if (cosResult.length > 0) {
                        Object.keys(gross_profit).forEach((item) => {
                          g_prop[item] = parseFloat(
                            parseFloat(incomeResult[0][item]) -
                              parseFloat(cosResult[0][item])
                          ).toFixed(decimal_places);
                        });
                      }
                      //setborder
                      let g_propit = [];
                      g_propit.push({
                        account_name: "Gross Profit",
                        label: "Gross Profit",
                        rowClass: "bordering",

                        ...g_prop,
                      });
                      req.records = {
                        columns,
                        income: incomeResult,
                        Direct_expense: directExpeneseResult,
                        Indirect_expense: cosResult,
                        gross_profit: g_propit,
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
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};

//created by irfan:
function generateProfitAndLoss(options) {
  try {
    return new Promise((resolve, reject) => {
      const {
        _mysql,
        columns,
        trans_symbol,
        decimal_places,
        qry,
        drillDownLevel,
      } = options;

      _mysql
        .executeQuery({
          query: qry,
          printQuery: false,
        })
        .then((result) => {
          const headObj = {};
          const childObj = {};

          const accounting_heads = result[0];
          const levels = result[1];

          let res = 2;

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
            decimal_places,
            drillDownLevel
          );
          resolve({ outputArray, max_level: levels });
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
  decimal_places,
  drillDownLevel
) {
  try {
    let roots = [],
      children = {};

    // find the top level nodes and hash the children based on parent_acc_id
    for (let i = 0, len = arry.length; i < len; ++i) {
      if (drillDownLevel !== 999) {
        if (arry[i]["account_level"] > drillDownLevel) {
          break;
        }
      }

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
        let tempchilds = children[parent.finance_account_head_id];

        if (drillDownLevel !== 999) {
          tempchilds = tempchilds.filter((f) => f.leafnode !== "Y");
        }
        if (tempchilds.length > 0) {
          parent.children = tempchilds;
          for (let i = 0, len = parent.children.length; i < len; ++i) {
            findChildren(parent.children[i]);
          }
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
