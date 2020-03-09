import algaehMysql from "algaeh-mysql";
import _ from "lodash";

import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  performSearch: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();

    let voucher_type = "";

    let joinStr = "";
    let whereStr = "";
    const input = req.query;
    switch (input.voucher_type) {
      case "journal":
      case "contra":
      case "receipt":
      case "payment":
      case "sales":
      case "purchase":
      case "credit_note":
      case "debit_note":
        voucher_type = input.voucher_type;
        break;
    }

    if (voucher_type != "") {
      whereStr = ` H.voucher_type=${voucher_type}  and `;
    }

    switch (input.search_in) {
      case "line_account":
        joinStr = `inner join finance_account_child C on VD.child_id=C.finance_account_child_id  `;

        if (input.search_type == "C") {
          whereStr = `  (C.ledger_code like  '%${input.value}%' or C.child_name like  '%${input.value}%' )`;
        } else if (input.search_type == "E") {
          whereStr = `  (C.ledger_code ='${input.value}' or C.child_name like  '${input.value}') `;
        }

      case "line_amount":
        if (input.search_type == "C") {
          whereStr = `  (VD.debit_amount like  '%${input.value}%' or VD.credit_amount like  '%${input.value}%' )`;
        } else if (input.search_type == "E") {
          whereStr = `  ( VD.debit_amount ='${input.value}' or VD.credit_amount like  '${input.value}')`;
        }
        break;
      case "line_desc":
        if (input.search_type == "C") {
          whereStr = `  H.narration like  '%${input.value}%'   `;
        } else if (input.search_type == "E") {
          whereStr = `  H.narration = '${input.value}'  `;
        }
        break;

      case "last_modified":
        whereStr = `  H.update_date = date('${input.value}')  `;

        break;
      case "invoice_no":
        if (input.search_type == "C") {
          whereStr = `  (H.invoice_no like  '%${input.value}%'  or H.invoice_ref_no like  '%${input.value}%')  `;
        } else if (input.search_type == "E") {
          whereStr = `  (H.invoice_no =  '${input.value}'  or H.invoice_ref_no =  '${input.value}')  `;
        }
        break;
      case "voucher_no":
        if (input.search_type == "C") {
          whereStr = `  H.voucher_no like  '%${input.value}%'   `;
        } else if (input.search_type == "E") {
          whereStr = `  H.voucher_no = '${input.value}'  `;
        }
        break;

      default:
        whereStr = "1=1";
    }

    _mysql
      .executeQuery({
        query: ` select distinct finance_voucher_header_id ,voucher_type,voucher_no,amount,
        H.payment_date as invoice_date ,coalesce( coalesce( invoice_no,invoice_ref_no),'-') invoice_no,
        updated_date ,H.narration from finance_voucher_header H  inner join 
        finance_voucher_details VD on H.finance_voucher_header_id=VD.voucher_header_id 
        and VD.auth_status='A'  ${joinStr} where ${whereStr};`,
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
