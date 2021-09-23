import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
// import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getSupplierPayables: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;
    _mysql
      .executeQuery({
        query: `select C.finance_account_child_id ,C.child_name,
        ROUND(  coalesce(sum(credit_amount) ,0)- coalesce(sum(debit_amount)   ,0),${decimal_places})
       as balance_amount,coalesce(V.bank_account_no,'-') as bank_account_no,V.contact_number from
       hims_d_vendor V inner join finance_account_child C  on V.child_id=C.finance_account_child_id
       left join finance_voucher_details VD
       on C.finance_account_child_id=VD.child_id and VD.auth_status='A'  group by C.finance_account_child_id;

        select round(coalesce(sum(amount)-sum(settled_amount),0),2)as over_due
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='purchase' and H.invoice_no is not null and
        VD.child_id in ( select child_id from hims_d_vendor)
        and H.settlement_status='P' and curdate()> due_date;

        select round(coalesce(sum(amount)-sum(settled_amount),0),2)as open
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='purchase' and H.invoice_no is not null and
        VD.child_id in ( select child_id from hims_d_vendor)
        and H.settlement_status='P';
        select count(finance_day_end_header_id) as day_end_pending from finance_day_end_header H
        inner join finance_day_end_sub_detail SD on H.finance_day_end_header_id= SD.day_end_header_id
        where SD.child_id in(select child_id from hims_d_vendor)  and  H.posted='N';    `,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        req.records = {
          result: result[0],
          over_due: result[1][0]["over_due"],
          total_receivable: result[2][0]["open"],
          day_end_pending: result[3][0]["day_end_pending"],
        };
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  getSupplierInvoiceDetails: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;

    /**   ToDo: this part is removed because values are not mating with data
     *  if incase two different invoices need to check new scenario this is an query at position zero */
    /*
select MAX(H.finance_voucher_header_id) as finance_voucher_header_id,round(H.amount ,${decimal_places}) as invoice_amount,
        round(MAX(H.amount)-coalesce(sum(FSH.amount),MAX(settled_amount)),${decimal_places})as balance_amount,
        round(coalesce(sum(FSH.amount),MAX(settled_amount)),${decimal_places}) as settled_amount,
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
        and H.voucher_type='purchase' and H.invoice_no is not null  and   D.child_id=?
	    	left join finance_voucher_sub_header FSH on 
        H.invoice_no = FSH.invoice_ref_no group by FSH.invoice_ref_no;

*/

    const child_id = req.query.child_id;
    _mysql
      .executeQuery({
        query: `
        select H.finance_voucher_header_id,round(H.amount ,${decimal_places}) as invoice_amount,
        round(H.amount-coalesce(FSH.amount,settled_amount),${decimal_places})as balance_amount,
        round(coalesce(FSH.amount,settled_amount),${decimal_places}) as settled_amount,
        coalesce(FSH.invoice_ref_no,invoice_no) as invoice_no ,
        FSH.invoice_ref_no,
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
        and H.voucher_type='purchase' and H.invoice_no is not null  and   D.child_id=?
	    	left join finance_voucher_sub_header FSH on
        H.invoice_no = FSH.invoice_ref_no;


        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as over_due
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='purchase' and H.invoice_no is not null and
        VD.child_id =?
        and H.settlement_status='P' and curdate()> due_date;

        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as open
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where   H.voucher_type='purchase' and H.invoice_no is not null and
        VD.child_id =?
        and H.settlement_status='P';


        select ROUND( coalesce(sum(debit_amount),0),${decimal_places}) as past_payments
        from  finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A'
        where  VD.child_id=? and voucher_type='payment' and
         H.payment_date >date_sub(curdate(), INTERVAL 30 DAY);

         select count(finance_day_end_header_id) as day_end_pending from finance_day_end_header H
        inner join finance_day_end_sub_detail SD on H.finance_day_end_header_id= SD.day_end_header_id
        
        where SD.child_id in(?)  and  H.posted='N';`,
        values: [child_id, child_id, child_id, child_id, child_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
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
          result: rptResult, //result[0] ,
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
};

export function getAllDebitNotes(req, res, next) {
  const _mysql = new algaehMysql();
  const child_id = req.query.child_id;
  try {
    _mysql
      .executeQuery({
        query: `select H.finance_voucher_header_id,H.voucher_no,H.invoice_no,H.amount,H.payment_date,H.narration,H.settled_amount,D.finance_voucher_id
from finance_voucher_header as H inner join finance_voucher_details as D
on H.finance_voucher_header_id = D.voucher_header_id
where H.voucher_type ='debit_note' and D.child_id = ? and H.settlement_status ='P';`,
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
export function getSuppReporttoPrint(req, res, next) {
  const _mysql = new algaehMysql();
  const decimal_places = req.userIdentity.decimal_places;
  try {
    _mysql
      .executeQuery({
        query: `select H.finance_voucher_header_id,round(H.amount ,${decimal_places}) as invoice_amount,
        round(H.amount-coalesce(FSH.amount,settled_amount),${decimal_places})as balance_amount,
        round(coalesce(FSH.amount,settled_amount),${decimal_places}) as settled_amount,
        coalesce(FSH.invoice_ref_no,invoice_no) as invoice_no ,
        FSH.invoice_ref_no,
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
          and H.voucher_type='purchase' and H.invoice_no is not null  and   D.child_id=?
          left join finance_voucher_sub_header FSH on H.invoice_no = FSH.invoice_ref_no
          where date(H.payment_date) between date(?) and date(?);`,
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
