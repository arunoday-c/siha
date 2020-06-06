import algaehMysql from "algaeh-mysql";
import _ from "lodash";

export default {
  //created by irfan:
  getCashFlowStatement: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;

    const input = req.query;

    _mysql
      .executeQuery({
        query: `SELECT finance_account_child_id ,child_name  FROM finance_account_child
        where  ledger_code='PL' limit 1;
        
        with recursive cte as (
          select finance_account_head_id,account_code,account_name,       
          parent_acc_id from finance_account_head   where  account_code='1.2.3' 
          union                 
          select H.finance_account_head_id,H.account_code,H.account_name,       
          H.parent_acc_id from finance_account_head H  
          inner join cte on H.parent_acc_id = cte.finance_account_head_id  
          )select * from cte ;
          
        
        with recursive cte as (
        select finance_account_head_id,account_code,account_name,       
        parent_acc_id from finance_account_head   where  account_code='1.2' 
        union                 
        select H.finance_account_head_id,H.account_code,H.account_name,       
        H.parent_acc_id from finance_account_head H  
        inner join cte on H.parent_acc_id = cte.finance_account_head_id 
        where H.account_code not in ( '1.2.3','1.2.4')
        )select * from cte ;
        
        
        with recursive cte as (
        select finance_account_head_id,account_code,account_name,       
        parent_acc_id from finance_account_head   where  account_code='2.2' 
        union                 
        select H.finance_account_head_id,H.account_code,H.account_name,       
        H.parent_acc_id from finance_account_head H  
        inner join cte on H.parent_acc_id = cte.finance_account_head_id  
        )select * from cte ;
        
        
        
        with recursive cte as (
        select finance_account_head_id,account_code,account_name,       
        parent_acc_id from finance_account_head   where  account_code='1.1' 
        union                 
        select H.finance_account_head_id,H.account_code,H.account_name,       
        H.parent_acc_id from finance_account_head H  
        inner join cte on H.parent_acc_id = cte.finance_account_head_id  
        )select * from cte ;
         
        
        with recursive cte as (
        select finance_account_head_id,account_code,account_name,       
        parent_acc_id from finance_account_head where account_code in ('2.1','3.1')
        union
        select H.finance_account_head_id,H.account_code,H.account_name,       
        H.parent_acc_id from finance_account_head H  
        inner join cte on H.parent_acc_id = cte.finance_account_head_id  
        )select * from cte ;`,
      })
      .then((result) => {
        //operating Activities
        const PL = result[0][0];
        const AR = result[1].map((m) => m.finance_account_head_id);

        const Current_Asset = result[2].map((m) => m.finance_account_head_id);
        const Current_Liability = result[3].map(
          (m) => m.finance_account_head_id
        );

        //Investing Activities

        const Fixed_Asset = result[4].map((m) => m.finance_account_head_id);

        //Financing Activities

        const Fixed_Liability = result[5].map((m) => m.finance_account_head_id);

        console.log("PL:", PL);

        console.log("AR:", AR);

        console.log("Current_Asset:", Current_Asset);

        console.log("Current_Liability:", Current_Liability);

        console.log("Fixed_Asset:", Fixed_Asset);

        console.log("Fixed_Liability:", Fixed_Liability);

        if (PL) {
          switch (input.display_column_by) {
            case "T":
              let data = {
                _mysql,
                PL,
                AR,
                Current_Asset,
                Current_Liability,
                Fixed_Asset,
                Fixed_Liability,
                decimal_places,
                from_date: input.from_date,
                to_date: input.to_date,
              };
              cashFlow_TotalsOnly(data)
                .then((result) => {
                  req.records = result;
                  next();
                })
                .catch((e) => {
                  console.log("e:", e);
                });
              break;

            case "M":
              break;

            case "Y":
              break;
            default:
              _mysql.releaseConnection();
              next(new Error("Please select coulmns to display"));
          }

          // next();
        } else {
          _mysql.releaseConnection();
          next(new Error("Profit and loss account not defined"));
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};

//created by irfan:
function cashFlow_TotalsOnly(options) {
  try {
    return new Promise((resolve, reject) => {
      const {
        _mysql,
        PL,
        AR,
        Current_Asset,
        Current_Liability,
        Fixed_Asset,
        Fixed_Liability,
        decimal_places,
        from_date,
        to_date,
      } = options;

      let sql_qry = `select  finance_account_child_id as child_id,child_name as name, 
                    ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as closing_bal
                    from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id 
                    and VD.auth_status='A' and  VD.payment_date < date('${from_date}') where finance_account_child_id=${PL.finance_account_child_id}
                    group by C.finance_account_child_id;

                    select  'Account Receivables' as name ,ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as 
                    closing_bal from finance_voucher_details where head_id in(${AR}) and auth_status='A'
                    and payment_date < date('${from_date}');

                    select  finance_account_child_id as child_id,child_name as name , 
                    ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
                    from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id 
                    and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
                    where C.head_id in (${Current_Asset})
                    group by C.finance_account_child_id;


                    select  finance_account_child_id as child_id,child_name as name , 
                    ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as  closing_bal
                    from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id 
                    and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
                    where C.head_id in (${Current_Liability})
                    group by C.finance_account_child_id;

                 
                    select finance_account_head_id, account_name as name ,
                    ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
                    from finance_account_head H left join finance_voucher_details VD on 
                    VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
                    where finance_account_head_id in(${Fixed_Asset}) group by H.finance_account_head_id ;


                    select finance_account_head_id, account_name as name ,
                    ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as  closing_bal
                    from finance_account_head H left join finance_voucher_details VD on 
                    VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
                    where finance_account_head_id in(${Fixed_Liability}) group by H.finance_account_head_id ;








                    select  finance_account_child_id as child_id,child_name as name, 
                    ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as closing_bal
                    from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id 
                    and VD.auth_status='A' and  VD.payment_date<=date('${to_date}') where finance_account_child_id=${PL.finance_account_child_id}
                    group by C.finance_account_child_id;                 

                    select  'Account Receivables' as name, ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as 
                    closing_bal from finance_voucher_details where head_id in(${AR}) and auth_status='A'
                    and payment_date <=date('${to_date}');
                
                    select  finance_account_child_id as child_id,child_name as name , 
                    ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
                    from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id 
                    and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
                    where C.head_id in (${Current_Asset})
                    group by C.finance_account_child_id;

                    select  finance_account_child_id as child_id,child_name as name , 
                    ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as   closing_bal
                    from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id 
                    and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
                    where C.head_id in (${Current_Liability})
                    group by C.finance_account_child_id;

 
                    select finance_account_head_id, account_name as name ,
                    ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
                    from finance_account_head H left join finance_voucher_details VD on 
                    VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
                    where finance_account_head_id in(${Fixed_Asset}) group by H.finance_account_head_id ;
 

                    select finance_account_head_id, account_name as name ,
                    ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as  closing_bal
                    from finance_account_head H left join finance_voucher_details VD on 
                    VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
                    where finance_account_head_id in(${Fixed_Liability}) group by H.finance_account_head_id ;    `;

      _mysql
        .executeQuery({
          query: sql_qry,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          // let _PL = result[0];
          // let _AR = result[1];

          // let _Current_Asset = result[2];
          // let _Current_Liability = result[3];
          // let _Fixed_Asset = result[4];
          // let _Fixed_Liability = result[5];

          // let len = parseInt(result.length) - 5;

          let coulmns = [
            {
              label: "Totals",
              colum_id: "total",
            },
          ];

          let t_pl = 0;
          let t_ar = 1;
          let t_ca = 2;
          let t_cl = 3;
          let t_fa = 4;
          let t_fl = 5;

          const dataArray = [
            {
              PL: result[0],
              AR: result[1],
              Current_Asset: result[2],
              Current_Liability: result[3],
              Fixed_Asset: result[4],
              Fixed_Liability: result[5],
            },
          ];

          let len = 2;

          for (let i = 0; i < len - 1; i++) {
            t_pl = parseInt(t_pl) + 6;
            t_ar = parseInt(t_ar) + 6;
            t_ca = parseInt(t_ca) + 6;
            t_cl = parseInt(t_cl) + 6;
            t_fa = parseInt(t_fa) + 6;
            t_fl = parseInt(t_fl) + 6;
            dataArray.push({
              PL: result[t_pl],
              AR: result[t_ar],
              Current_Asset: result[t_ca],
              Current_Liability: result[t_cl],
              Fixed_Asset: result[t_fa],
              Fixed_Liability: result[t_fl],
            });
          }

          let _PL = {
            name: result[0][0]["name"],
            child_id: result[0][0]["child_id"],
          };

          let _AR = {
            name: result[1][0]["name"],
          };

          let _Current_Asset = result[2];

          let _Current_Liability = result[3];
          let _Fixed_Asset = result[4];
          let _Fixed_Liability = result[5];

          let net_operating = {};
          let net_investing = {};
          let net_financing = {};
          // comparission in done one time b/w 2 things so lenth-1
          for (let i = 0, lenth = dataArray.length; i < lenth - 1; i++) {
            let colum_id = coulmns[i]["colum_id"];

            let operating_amount = 0;
            let investing_amount = 0;
            let financing_amount = 0;

            let pl_amount =
              parseFloat(dataArray[i + 1]["PL"][0]["closing_bal"]) -
              parseFloat(dataArray[i]["PL"][0]["closing_bal"]);

            _PL[colum_id] = pl_amount;

            operating_amount =
              parseFloat(operating_amount) + parseFloat(pl_amount);

            let ar_amount =
              parseFloat(dataArray[i]["AR"][0]["closing_bal"]) -
              parseFloat(dataArray[i + 1]["AR"][0]["closing_bal"]);

            _AR[colum_id] = ar_amount;

            operating_amount =
              parseFloat(operating_amount) + parseFloat(ar_amount);

            _Current_Asset.forEach((item) => {
              let A = dataArray[i]["Current_Asset"].find((f) => {
                return f.child_id == item.child_id;
              });

              let B = dataArray[i + 1]["Current_Asset"].find((f) => {
                return f.child_id == item.child_id;
              });

              let ca_amount =
                parseFloat(A["closing_bal"]) - parseFloat(B["closing_bal"]);

              item[colum_id] = ca_amount;

              operating_amount =
                parseFloat(operating_amount) + parseFloat(ca_amount);
            });

            _Current_Liability.forEach((item) => {
              let A = dataArray[i]["Current_Liability"].find((f) => {
                return f.child_id == item.child_id;
              });

              let B = dataArray[i + 1]["Current_Liability"].find((f) => {
                return f.child_id == item.child_id;
              });

              let cl_amount = parseFloat(
                B["closing_bal"] - parseFloat(A["closing_bal"])
              );

              item[colum_id] = cl_amount;

              operating_amount =
                parseFloat(operating_amount) + parseFloat(cl_amount);
            });

            _Fixed_Asset.forEach((item) => {
              let A = dataArray[i]["Fixed_Asset"].find((f) => {
                return (
                  f.finance_account_head_id == item.finance_account_head_id
                );
              });

              let B = dataArray[i + 1]["Fixed_Asset"].find((f) => {
                return (
                  f.finance_account_head_id == item.finance_account_head_id
                );
              });

              let fa_amount =
                parseFloat(A["closing_bal"]) - parseFloat(B["closing_bal"]);
              item[colum_id] = fa_amount;

              investing_amount =
                parseFloat(investing_amount) + parseFloat(fa_amount);
            });

            _Fixed_Liability.forEach((item) => {
              let A = dataArray[i]["Fixed_Liability"].find((f) => {
                return (
                  f.finance_account_head_id == item.finance_account_head_id
                );
              });

              let B = dataArray[i + 1]["Fixed_Liability"].find((f) => {
                return (
                  f.finance_account_head_id == item.finance_account_head_id
                );
              });

              let fl_amount = parseFloat(
                B["closing_bal"] - parseFloat(A["closing_bal"])
              );
              item[colum_id] = fl_amount;

              financing_amount =
                parseFloat(financing_amount) + parseFloat(fl_amount);
            });

            net_operating[colum_id] = operating_amount;
            net_investing[colum_id] = investing_amount;
            net_financing[colum_id] = financing_amount;
          }

          // resolve(dataArray);

          resolve({
            O: [_PL, _AR, ..._Current_Asset, ..._Current_Liability],
            I: _Fixed_Asset,
            F: _Fixed_Liability,
            net_operating,
            net_investing,
            net_financing,
            coulmns,
          });
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

//created by irfan:
function cashFlow_monthly(options) {
  try {
    return new Promise((resolve, reject) => {});
  } catch (e) {
    console.log("e:", e);
  }
}

//created by irfan:
function cashFlow_yearly(options) {
  try {
    return new Promise((resolve, reject) => {});
  } catch (e) {
    console.log("e:", e);
  }
}

// let sql_qry = `select  finance_account_child_id as child_id,child_name,
// ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as closing_bal
// from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
// and VD.auth_status='A' and  VD.payment_date < date('${from_date}') where finance_account_child_id=${PL.finance_account_child_id}
// group by C.finance_account_child_id;

// select  finance_account_child_id as child_id,child_name,
// ROUND((coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as closing_bal
// from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
// and VD.auth_status='A' and  VD.payment_date<=date('${to_date}') where finance_account_child_id=${PL.finance_account_child_id}
// group by C.finance_account_child_id;

// select  ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as
// closing_bal from finance_voucher_details where head_id in(${AR}) and auth_status='A'
// and payment_date < date('${from_date}');

// select  ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as
// closing_bal from finance_voucher_details where head_id in(${AR}) and auth_status='A'
// and payment_date <=date('${to_date}');

// select  finance_account_child_id as child_id,child_name,
// ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
// from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
// and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
// where C.head_id in (${Current_Asset})
// group by C.finance_account_child_id;

// select  finance_account_child_id as child_id,child_name,
// ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
// from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
// and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
// where C.head_id in (${Current_Asset})
// group by C.finance_account_child_id;

// select  finance_account_child_id as child_id,child_name,
// ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as  closing_bal
// from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
// and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
// where C.head_id in (${Current_Liability})
// group by C.finance_account_child_id;

// select  finance_account_child_id as child_id,child_name,
// ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as   closing_bal
// from   finance_account_child C left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id
// and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
// where C.head_id in (${Current_Liability})
// group by C.finance_account_child_id;

// select finance_account_head_id, account_name,
// ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
// from finance_account_head H left join finance_voucher_details VD on
// VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
// where finance_account_head_id in(${Fixed_Asset}) group by H.finance_account_head_id ;

// select finance_account_head_id, account_name,
// ROUND((coalesce(sum( debit_amount ) ,0)- coalesce(sum(credit_amount) ,0) ),${decimal_places}) as  closing_bal
// from finance_account_head H left join finance_voucher_details VD on
// VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
// where finance_account_head_id in(${Fixed_Asset}) group by H.finance_account_head_id ;

// select finance_account_head_id, account_name,
// ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as  closing_bal
// from finance_account_head H left join finance_voucher_details VD on
// VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date < date('${from_date}')
// where finance_account_head_id in(${Fixed_Liability}) group by H.finance_account_head_id ;

// select finance_account_head_id, account_name,
// ROUND((coalesce(sum( credit_amount  ) ,0)- coalesce(sum(debit_amount) ,0) ),${decimal_places}) as  closing_bal
// from finance_account_head H left join finance_voucher_details VD on
// VD.head_id=H.finance_account_head_id and VD.auth_status='A' and  VD.payment_date <= date('${to_date}')
// where finance_account_head_id in(${Fixed_Liability}) group by H.finance_account_head_id ;

// `;
