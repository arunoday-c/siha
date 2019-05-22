import algaehMysql from "algaeh-mysql";
import _ from "lodash";

module.exports = {
  getLeaveSalaryAccural: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;

    let inputValues = [inputParam.year, inputParam.month];
    let _stringData = "";

    _stringData += " and E.hims_d_employee_id=?";
    inputValues.push(req.userIdentity.hospital_id);
    if (inputParam.employee_id != null) {
      _stringData += " and D.employee_id=?";
      inputValues.push(inputParam.employee_id);
    }

    _mysql
      .executeQuery({
        query:
          "select D.year, D.month, D.leave_days, D.leave_salary, D.airfare_amount, H.leave_salary_number \
          , E.employee_code, E.full_name from  hims_f_leave_salary_accrual_detail D, hims_d_employee E\
          , hims_f_leave_salary_accrual_header H where E.hims_d_employee_id = D.employee_id and \
          D.leave_salary_header_id=H.hims_f_leave_salary_accrual_header_id  and D.year=? and D.month=?" +
          _stringData,
        values: inputValues,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  }
};
