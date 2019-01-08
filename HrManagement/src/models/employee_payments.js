import algaehMysql from "algaeh-mysql";
import { debugLog, debugFunction } from "../../../src/utils/logging";
import _ from "lodash";
module.exports = {
  getLoanTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _loanDetails = req.query;

    let _stringData =
      _loanDetails.employee_id != null ? " and employee_id=? " : "";
    _stringData +=
      _loanDetails.document_num != null
        ? " and loan_application_number=? "
        : "";

    /* Select statemwnt  */
    debugLog("_loanDetails", _loanDetails);
    debugLog("_stringData", _stringData);
    _mysql
      .executeQueryWithTransaction({
        query:
          "select loan.hims_f_loan_application_id, loan.loan_application_number, loan.approved_amount,emp.employee_code, \
          emp.full_name from hims_f_loan_application loan, hims_d_employee emp where  start_month=? and start_year=? \
          and loan_authorized =? and loan.employee_id = emp.hims_d_employee_id" +
          _stringData,
        values: _.valuesIn(_loanDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
        });

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "LN"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  }
};
