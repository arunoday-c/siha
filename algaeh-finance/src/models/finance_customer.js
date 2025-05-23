import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getCustomerReceivables: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;

    // Below query cut from below due to performance issue ------ in Customer List
    // select count(finance_day_end_header_id) as day_end_pending from finance_day_end_header H
    // inner join finance_day_end_sub_detail SD on H.finance_day_end_header_id= SD.day_end_header_id
    // where SD.child_id in(select child_id from hims_d_customer
    //   union all
    //   select child_id from hims_d_insurance_sub  where child_id is not null)  and  H.posted='N';

    _mysql
      .executeQuery({
        query: `select C.finance_account_child_id ,C.ledger_code,C.child_name,VD.is_opening_bal,customer_type,
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

       
          
          `,

        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        // req.records = result;
        req.records = {
          result: result[0],
          over_due: result[1][0]["over_due"],
          total_receivable: result[2][0]["open"],
          // day_end_pending: result[3][0]["day_end_pending"],
        };
        next();
      })
      .catch((e) => {
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

    /**
     * ToDo: this part is removed because values are not mating with data
     *  if incase two different invoices need to check new scenario this is an query at position zero 
     * 
     * select MAX(H.finance_voucher_header_id) as finance_voucher_header_id,MAX(H.day_end_header_id) as day_end_header_id, round(H.amount ,2) as invoice_amount,
        round(MAX(H.amount)-coalesce(sum(FSH.amount),MAX(settled_amount)),2) as balance_amount,
        round(coalesce(sum(FSH.amount),MAX(settled_amount)),2) as settled_amount,
        coalesce(FSH.invoice_ref_no,MAX(invoice_no)) as invoice_no ,
       MAX( H.voucher_type)as voucher_type,MAX(H.narration) as narration,
       MAX(H.payment_date) as invoice_date,
        MAX(due_date)as due_date, MAX(H.updated_date) as last_modified,
        case when MAX(settlement_status)  ='S' then 'closed'
        when MAX(settlement_status)='P' and curdate()> MAX(due_date) then 'over due'
        when MAX(settlement_status)='P' and SUM(settled_amount)<1 then 'open'
        when MAX(settlement_status)='P' and SUM(settled_amount)>0 then 'paid' end as invoice_status,
        MAX(D.child_id) as child_id,MAX(D.head_id) as head_id, D.is_opening_bal, H.voucher_no
        from finance_voucher_header H 
        inner join finance_voucher_details D on
        H.finance_voucher_header_id=D.voucher_header_id 
        and H.voucher_type='sales' and H.invoice_no is not null  and  D.child_id=?
	    	left join finance_voucher_sub_header FSH on 
        H.invoice_no = FSH.invoice_ref_no group by H.invoice_no;
     */
    _mysql
      .executeQuery({
        query: ` 
        select H.finance_voucher_header_id,H.day_end_header_id,
        round(H.amount ,${decimal_places}) as invoice_amount,
               round(H.amount-coalesce(FSH.amount,settled_amount),${decimal_places}) as balance_amount,
               round(coalesce(FSH.amount,settled_amount),${decimal_places}) as settled_amount,
               coalesce(FSH.invoice_ref_no, invoice_no) as invoice_no ,
              H.voucher_type,H.narration,
              H.payment_date as invoice_date,
                due_date, H.updated_date as last_modified,
               case when settlement_status  ='S' then 'closed'
               when settlement_status='P' and curdate()> due_date then 'over due'
               when settlement_status='P' and settled_amount<1 then 'open'
               when settlement_status='P' and settled_amount>0 then 'paid' end as invoice_status,
               D.child_id,D.head_id, D.is_opening_bal, H.voucher_no,H.custom_ref_no,
               C.finance_account_child_id,
               C.child_name
               from finance_voucher_header H
               inner join finance_voucher_details D on
               H.finance_voucher_header_id=D.voucher_header_id
               and H.voucher_type='sales' and H.invoice_no is not null  and  D.child_id=?
               left join finance_voucher_sub_header FSH on
               H.invoice_no = FSH.invoice_ref_no and FSH.voucher_type <> 'credit_note'
               inner join finance_account_child as C on D.child_id=C.finance_account_child_id;
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
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        // req.records = result;
        const rptResult = _.chain(result[0])
          .groupBy((g) => g.invoice_no)
          .map((item, key) => {
            const header = _.head(item);
            const settled_amount = _.sumBy(item, (s) =>
              parseFloat(s.settled_amount)
            );
            const balance_amount =
              parseFloat(header.invoice_amount ?? 0) - settled_amount;
            return {
              ...header,
              settled_amount,
              balance_amount,
              last_modified: moment(
                new Date(
                  Math.max.apply(
                    null,
                    item.map((d) => new Date(d.last_modified))
                  )
                )
              ).format("DD-MM-YYYY HH:mm:ss"),
            };
          })
          .orderBy((o) => o.invoice_date, "desc")
          .value();
        req.records = {
          result: rptResult, //result[0],
          over_due: result[1][0]["over_due"],
          total_receivable: result[2][0]["open"],
          past_payments: result[3][0]["past_payments"],
          day_end_pending: result[4][0]["day_end_pending"],
        };
        next();
      })
      .catch((e) => {
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
          const header_data = voucher_result[0][0];
          const detail_data = voucher_result[1];
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
                day_end_header_id,
              ],
              printQuery: true,
            })
            .then((result) => {
              const header_result = result[0];
              console.log("header_result", header_result);
              console.log("result", result);

              _mysql
                .executeQueryWithTransaction({
                  query:
                    "insert into finance_voucher_revert_details (??) values ?;",
                  values: detail_data,
                  bulkInsertOrUpdate: true,
                  printQuery: true,
                  // excludeValues: ["disabled", "paytypedisable"],
                  extraValues: {
                    revert_header_id: header_result.insertId,
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
  },
};

export function getAllCreditNotes(req, res, next) {
  const _mysql = new algaehMysql();
  const child_id = req.query.child_id;
  try {
    _mysql
      .executeQuery({
        query: `select H.finance_voucher_header_id,H.voucher_no,H.invoice_no,H.amount, \
        H.payment_date,H.narration,H.settled_amount,D.finance_voucher_id
        from finance_voucher_header as H inner join finance_voucher_details as D
        on H.finance_voucher_header_id = D.voucher_header_id
        where H.voucher_type ='credit_note'  and H.settlement_status ='P' and D.child_id = ? ;`,
        values: [child_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
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
export function getCustomerAdvance(req, res, next) {
  const _mysql = new algaehMysql();
  const child_id = req.query.child_id;
  try {
    _mysql
      .executeQuery({
        query: `select H.finance_voucher_header_id,H.voucher_no,H.invoice_no,H.amount,H.payment_date, H.narration, \
              H.settled_amount,D.finance_voucher_id from finance_voucher_header as H inner join finance_voucher_details as D
              on H.finance_voucher_header_id = D.voucher_header_id
              where H.is_advance ='Y' and H.settlement_status ='P'  and D.child_id = ? ;`,
        values: [child_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
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
export function getCustomerReporttoPrint(req, res, next) {
  const _mysql = new algaehMysql();
  const decimal_places = req.userIdentity.decimal_places;
  try {
    _mysql
      .executeQuery({
        query: `select H.finance_voucher_header_id,H.day_end_header_id,
        round(H.amount ,${decimal_places}) as invoice_amount,
        round(H.amount-coalesce(FSH.amount,settled_amount),${decimal_places}) as balance_amount,
        round(coalesce(FSH.amount,settled_amount),${decimal_places}) as settled_amount,
        coalesce(FSH.invoice_ref_no, invoice_no) as invoice_no ,
        H.voucher_type,H.narration,
        H.payment_date as invoice_date,
        due_date, H.updated_date as last_modified,
        case when settlement_status  ='S' then 'closed'
        when settlement_status='P' and curdate()> due_date then 'over due'
        when settlement_status='P' and settled_amount<1 then 'open'
        when settlement_status='P' and settled_amount>0 then 'paid' end as invoice_status,
        D.child_id,D.head_id, D.is_opening_bal, H.voucher_no
        from finance_voucher_header H
        inner join finance_voucher_details D on
        H.finance_voucher_header_id=D.voucher_header_id
        and H.voucher_type='sales' and H.invoice_no is not null  and  D.child_id=?
        left join finance_voucher_sub_header FSH on
        H.invoice_no = FSH.invoice_ref_no where date(H.payment_date) between date(?) and date(?)`,
        values: [req.query.child_id, req.query.from_date, req.query.to_date],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
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
