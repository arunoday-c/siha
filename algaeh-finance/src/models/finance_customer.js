import algaehMysql from "algaeh-mysql";
import _ from "lodash";

import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getCustomerReceivables: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;
    _mysql
      .executeQuery({
        query: `select C.finance_account_child_id ,C.child_name,VD.is_opening_bal,
         ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})
        as balance_amount from finance_account_child C left join finance_voucher_details VD
        on C.finance_account_child_id=VD.child_id and VD.auth_status='A'  where  finance_account_child_id in (
          select child_id from hims_d_customer
          union all
          select child_id from hims_d_insurance_sub  where child_id is not null) group by C.finance_account_child_id;
        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as over_due
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='sales' and H.invoice_no is not null and VD.child_id in ( select child_id from hims_d_customer
          union all
          select child_id from hims_d_insurance_sub  where child_id is not null)
        and H.settlement_status='P' and curdate()> due_date;
        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as open
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='sales' and H.invoice_no is not null and VD.child_id in ( select child_id from hims_d_customer
          union all
          select child_id from hims_d_insurance_sub  where child_id is not null)
        and H.settlement_status='P';

        select count(finance_day_end_header_id) as day_end_pending from finance_day_end_header H
        inner join finance_day_end_sub_detail SD on H.finance_day_end_header_id= SD.day_end_header_id
        where SD.child_id in(select child_id from hims_d_customer
          union all
          select child_id from hims_d_insurance_sub  where child_id is not null)  and  H.posted='N';   `,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        // req.records = result;
        req.records = {
          result: result[0],
          over_due: result[1][0]["over_due"],
          total_receivable: result[2][0]["open"],
          day_end_pending: result[3][0]["day_end_pending"]
        };
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  getCustomerInvoiceDetails: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;
    const child_id = req.query.child_id;

    //H.invoice_no is not null
    _mysql
      .executeQuery({
        query: `select finance_voucher_header_id, day_end_header_id,round(amount ,${decimal_places})as invoice_amount,
        round(amount-settled_amount,${decimal_places})as balance_amount,
        round(settled_amount,${decimal_places}) as settled_amount,
        invoice_no ,voucher_type,H.narration,H.payment_date as invoice_date,
        due_date, updated_date as last_modified,
        case when settlement_status='S' then 'closed'
        when settlement_status='P' and curdate()> due_date then 'over due'
        when settlement_status='P' and settled_amount<1 then 'open'
        when settlement_status='P' and settled_amount>0 then 'paid' end as invoice_status,
        D.child_id,D.head_id
        from finance_voucher_header H inner join finance_voucher_details D on
        H.finance_voucher_header_id=D.voucher_header_id
        and H.voucher_type='sales' and H.invoice_no is not null
        and  D.child_id=?;

        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as over_due
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='sales' and H.invoice_no is not null and VD.child_id=?
        and H.settlement_status='P' and curdate()> due_date;

        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as open
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='sales' and H.invoice_no is not null and VD.child_id=?
        and H.settlement_status='P';

        select ROUND( coalesce(sum(credit_amount),0),${decimal_places}) as past_payments
        from  finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where  VD.child_id=? and voucher_type='receipt' and
        H.payment_date >date_sub(curdate(), INTERVAL 30 DAY);
        select count(finance_day_end_header_id) as day_end_pending from finance_day_end_header H
        inner join finance_day_end_sub_detail SD on H.finance_day_end_header_id= SD.day_end_header_id
        where SD.child_id in(?)  and  H.posted='N';`,
        values: [child_id, child_id, child_id, child_id, child_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        // req.records = result;

        req.records = {
          result: result[0],
          over_due: result[1][0]["over_due"],
          total_receivable: result[2][0]["open"],
          past_payments: result[3][0]["past_payments"],
          day_end_pending: result[4][0]["day_end_pending"]
        };
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  revrtInvocieBack: (req, res, next) => {
    const _mysql = new algaehMysql();
    const { finance_voucher_header_id, day_end_header_id } = req.body;
    try {
      _mysql
        .executeQueryWithTransaction({
          query: `select * from finance_voucher_header where finance_voucher_header_id=?;
                select   finance_voucher_id, voucher_header_id, payment_date, month, year, head_id,
                child_id, debit_amount, payment_type, narration, credit_amount, hospital_id, pl_entry,
                is_opening_bal, is_new_entry, project_id, sub_department_id 
                from finance_voucher_details where voucher_header_id=?;`,
          values: [finance_voucher_header_id, finance_voucher_header_id],
          printQuery: true,
        })
        .then((voucher_result) => {
          const header_data = voucher_result[0][0]
          const detail_data = voucher_result[1]
          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO `finance_voucher_revert_header` (finance_voucher_header_id, payment_mode,ref_no,cheque_date,amount, \
                payment_date, month, year, narration, voucher_no, voucher_type,from_screen,invoice_no,\
                invoice_ref_no,posted_from, created_by, updated_by, created_date, updated_date)\
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);\
                DELETE from finance_voucher_details where voucher_header_id=?;\
                DELETE from finance_voucher_header where finance_voucher_header_id=?;\
                UPDATE finance_day_end_header set posted='N' where finance_day_end_header_id=?;",
              values: [
                header_data.finance_voucher_header_id,
                header_data.payment_mode,
                header_data.ref_no,
                header_data.cheque_date,
                header_data.amount,
                header_data.payment_date,
                header_data.month,
                header_data.year,
                header_data.narration,
                header_data.voucher_no,
                header_data.voucher_type,
                header_data.from_screen,
                header_data.invoice_no,
                header_data.invoice_ref_no,
                header_data.posted_from,
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                new Date(),
                finance_voucher_header_id,
                finance_voucher_header_id,
                day_end_header_id
              ],
              printQuery: true,
            })
            .then((result) => {
              const header_result = result[0]
              console.log("header_result", header_result)
              console.log("result", result)

              _mysql
                .executeQueryWithTransaction({
                  query: "insert into finance_voucher_revert_details (??) values ?;",
                  values: detail_data,
                  bulkInsertOrUpdate: true,
                  printQuery: true,
                  // excludeValues: ["disabled", "paytypedisable"],
                  extraValues: {
                    revert_header_id: header_result.insertId
                  },
                })
                .then((result2) => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result2;
                    next();
                  });
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
