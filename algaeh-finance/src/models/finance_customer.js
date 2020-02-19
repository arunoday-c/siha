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
        select child_id from hims_d_customer) group by C.finance_account_child_id; `,
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
  getCustomerInvoiceDetails: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    // const decimal_places = req.userIdentity.decimal_places;
    _mysql
      .executeQuery({
        query: `select finance_voucher_header_id ,amount as invoice_amount,
        settled_amount,(amount-settled_amount) as balace_amount,
        invoice_no ,voucher_no,voucher_type,narration
        from finance_voucher_header H inner join finance_voucher_details D on 
        H.finance_voucher_header_id=D.voucher_header_id 
        and voucher_type='payment' and invoice_no is not null   
        where  D.child_id=?; `,
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
