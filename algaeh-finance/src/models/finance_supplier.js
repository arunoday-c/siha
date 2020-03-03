import algaehMysql from "algaeh-mysql";
import _ from "lodash";

import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getSupplierPayables: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;
    _mysql
      .executeQuery({
        query: `select C.finance_account_child_id ,C.child_name,
         ROUND(  (coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount)   ,0.0000)),${decimal_places})
        as balance_amount from finance_account_child C left join finance_voucher_details VD
        on C.finance_account_child_id=VD.child_id and VD.auth_status='A'  where  finance_account_child_id in (
        select child_id from hims_d_vendor) group by C.finance_account_child_id; `,
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
  //created by irfan:
  getSupplierInvoiceDetails: (req, res, next) => {
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
        and H.voucher_type='purchase' and H.invoice_no is not null   
        and  D.child_id=?; `,
        values: [req.query.child_id],
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
  }
};
