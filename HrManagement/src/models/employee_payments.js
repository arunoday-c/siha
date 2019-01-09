import algaehMysql from "algaeh-mysql";
import { debugLog, debugFunction } from "../../../src/utils/logging";
import _ from "lodash";
module.exports = {
  getLoanTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _loanDetails = req.query;

    let _stringData =
      _loanDetails.employee_id != null ? " and loan.employee_id=? " : "";

    _stringData +=
      _loanDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _loanDetails.loan_application_number != null
        ? " and loan.loan_application_number=? "
        : "";

    /* Select statemwnt  */
    debugLog("_loanDetails", _loanDetails);
    debugLog("_stringData", _stringData);
    _mysql
      .executeQueryWithTransaction({
        query:
          "select loan.hims_f_loan_application_id, loan.loan_application_number as request_number, loan.employee_id, loan.approved_amount as payment_amount,\
          emp.employee_code,emp.full_name from hims_f_loan_application loan, hims_d_employee emp where loan.loan_authorized = ? and \
          loan.employee_id = emp.hims_d_employee_id " +
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
  },

  getAdvanceTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _advDetails = req.query;

    let _stringData =
      _advDetails.employee_id != null ? " and adv.employee_id=? " : "";

    _stringData +=
      _advDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _advDetails.advance_number != null ? " and adv.advance_number=? " : "";

    /* Select statemwnt  */
    debugLog("_advDetails", _advDetails);
    debugLog("_stringData", _stringData);
    _mysql
      .executeQueryWithTransaction({
        query:
          "select adv.hims_f_employee_advance_id, adv.advance_number as request_number, adv.employee_id, adv.advance_amount as payment_amount,\
          adv.deducting_month,adv.deducting_year,emp.employee_code, emp.full_name from hims_f_employee_advance adv, \
          hims_d_employee emp where adv.advance_status = ? and adv.employee_id = emp.hims_d_employee_id " +
          _stringData,
        values: _.valuesIn(_advDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
        });

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "AD"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  }
};
