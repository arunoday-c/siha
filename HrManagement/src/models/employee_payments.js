import algaehMysql from "algaeh-mysql";
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

    _mysql
      .executeQuery({
        query:
          "select loan.hims_f_loan_application_id, loan.loan_application_number as request_number, loan.employee_id, loan.approved_amount as payment_amount,\
          emp.employee_code,emp.full_name from hims_f_loan_application loan, hims_d_employee emp where loan.loan_authorized = ? and \
          loan.employee_id = emp.hims_d_employee_id " +
          _stringData,
        values: _.valuesIn(_loanDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

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

    _mysql
      .executeQuery({
        query:
          "select adv.hims_f_employee_advance_id, adv.advance_number as request_number, adv.employee_id, adv.advance_amount as payment_amount,\
          adv.deducting_month,adv.deducting_year,emp.employee_code, emp.full_name from hims_f_employee_advance adv, \
          hims_d_employee emp where adv.advance_status = ? and adv.employee_id = emp.hims_d_employee_id " +
          _stringData,
        values: _.valuesIn(_advDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

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
  },

  InsertEncashment: (req, res, next) => {
    const _mysql = new algaehMysql();
    let inputParam = { ...req.body };
    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_f_employee_payments` (payment_application_code,employee_id,employee_advance_id,\
            employee_loan_id,employee_leave_encash_id,employee_end_of_service_id,employee_final_settlement_id,\
            employee_leave_settlement_id,payment_type,payment_date,remarks,earnings_id,deduction_month,payment_amount,\
            payment_mode,cheque_number,created_date,created_by,updated_date,updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          payment_application_code,
          inputParam.employee_id,
          inputParam.employee_advance_id,
          inputParam.employee_loan_id,
          inputParam.employee_leave_encash_id,
          inputParam.employee_end_of_service_id,
          inputParam.employee_final_settlement_id,
          inputParam.employee_leave_settlement_id,
          inputParam.payment_type,
          inputParam.payment_date,
          inputParam.remarks,
          inputParam.earnings_id,
          inputParam.deduction_month,
          inputParam.payment_amount,
          inputParam.payment_mode,
          inputParam.cheque_number,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ]
      })
      .then(result => {
        if (inputParam.payment_type === "AD") {
          _mysql.executeQuery({
            query:
              "UPDATE `hims_f_employee_advance` SET `advance_status`='PAID' and `updated_date`=? and `updated_by`=? \
              where hims_f_employee_advance_id=?",
            values: [
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.employee_advance_id
            ]
          });
        } else if (inputParam.payment_type === "LN") {
          _mysql.executeQuery({
            query:
              "UPDATE `hims_f_loan_application` SET `loan_authorized`='IS' and `updated_date`=? and `updated_by`=? \
              where hims_f_loan_application_id=?",
            values: [
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.employee_loan_id
            ]
          });
        } else if (inputParam.payment_type === "EN") {
          _mysql.executeQuery({
            query:
              "UPDATE `hims_f_leave_encash_header` SET `authorized`='PRO' and `updated_date`=? and `updated_by`=? \
              where hims_f_leave_encash_header_id=?",
            values: [
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.employee_leave_encash_id
            ]
          });
        } else if (inputParam.payment_type === "GR") {
        } else if (inputParam.payment_type === "FS") {
        } else if (inputParam.payment_type === "LS") {
        }

        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
      })
      .catch(e => {
        next(e);
      });
  }
};
