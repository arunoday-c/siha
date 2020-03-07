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
        query: `select C.finance_account_child_id ,C.child_name,
         ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})
        as balance_amount from finance_account_child C left join finance_voucher_details VD
        on C.finance_account_child_id=VD.child_id and VD.auth_status='A'  where  finance_account_child_id in (
        select child_id from hims_d_customer) group by C.finance_account_child_id;
        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as over_due 
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A' 
        where   H.voucher_type='sales' and H.invoice_no is not null and VD.child_id in ( select child_id from hims_d_customer) 
        and H.settlement_status='P' and curdate()> due_date; 
        select round(coalesce(sum(amount)-sum(settled_amount),0),${decimal_places})as open
        from finance_voucher_header H inner join finance_voucher_details VD
        on H.finance_voucher_header_id=VD.voucher_header_id and VD.auth_status='A' 
        where   H.voucher_type='sales' and H.invoice_no is not null and VD.child_id in ( select child_id from hims_d_customer) 
        and H.settlement_status='P'; `,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        // req.records = result;
        req.records = {
          result: result[0],
          over_due: result[1][0]["over_due"],
          total_receivable: result[2][0]["open"]
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
    _mysql
      .executeQuery({
        query: `select finance_voucher_header_id ,round(amount ,${decimal_places})as invoice_amount,
        round(amount-settled_amount,${decimal_places})as balance_amount,
        round(settled_amount,${decimal_places}) as settled_amount,
        invoice_no ,voucher_type,narration,H.payment_date as invoice_date,
        due_date, update_date as last_modified,
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
        H.payment_date >date_sub(curdate(), INTERVAL 30 DAY);`,
        values: [
          req.query.child_id,
          req.query.child_id,
          req.query.child_id,
          req.query.child_id
        ],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        // req.records = result;

        req.records = {
          result: result[0],
          over_due: result[1][0]["over_due"],
          total_receivable: result[2][0]["open"],
          past_payments: result[3][0]["past_payments"]
        };
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  }
};
