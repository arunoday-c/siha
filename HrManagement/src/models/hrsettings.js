import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";
module.exports = {
  getEmployeeGroups: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select hims_d_employee_group_id, group_description,\
          monthly_accrual_days, airfare_eligibility, airfare_amount from hims_d_employee_group\
         where record_status='A'  order by hims_d_employee_group_id desc",
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
  },

  addEmployeeGroups: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    utilities
      .AlgaehUtilities()
      .logger()
      .log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "INSERT  INTO hims_d_employee_group(group_description,monthly_accrual_days,airfare_eligibility,airfare_amount,\
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?,?)",
        values: [
          input.group_description,
          input.monthly_accrual_days,
          input.airfare_eligibility,
          input.airfare_amount,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  updateEmployeeGroup: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    utilities
      .AlgaehUtilities()
      .logger()
      .log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_employee_group SET group_description = ?,\
          monthly_accrual_days = ?, airfare_eligibility = ?, airfare_amount = ?, record_status=?\
          ,updated_date=?, updated_by=?  WHERE hims_d_employee_group_id = ?",
        values: [
          input.group_description,
          input.monthly_accrual_days,
          input.airfare_eligibility,
          input.airfare_amount,
          input.record_status,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_employee_group_id
        ]
      })
      .then(update_loan => {
        _mysql.releaseConnection();
        req.records = update_loan;
        next();
      })
      .catch(e => {
        next(e);
      });
  },
  getDesignations: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "SELECT hims_d_designation_id, designation_code, designation , created_date FROM `hims_d_designation` \
          WHERE `record_status`='A' order by hims_d_designation_id desc",
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
  },

  addDesignation: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    utilities
      .AlgaehUtilities()
      .logger()
      .log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "INSERT  INTO hims_d_designation (designation_code, designation, \
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?)",
        values: [
          input.designation_code,
          input.designation,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  updateDesignation: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    utilities
      .AlgaehUtilities()
      .logger()
      .log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_designation SET designation_code = ?,\
          designation = ?, record_status=?\
          ,updated_date=?, updated_by=?  WHERE hims_d_designation_id = ?",
        values: [
          input.designation_code,
          input.designation,
          input.record_status,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_designation_id
        ]
      })
      .then(update_loan => {
        _mysql.releaseConnection();
        req.records = update_loan;
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  getOvertimeGroups: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    let _stringData = "";
    let inputValues = [];
    if (input.hims_d_overtime_group_id != null) {
      _stringData += " and hims_d_overtime_group_id=?";
      inputValues.push(input.hims_d_overtime_group_id);
    }

    _mysql
      .executeQuery({
        query:
          "SELECT hims_d_overtime_group_id, overtime_group_code, overtime_group_description, overtime_group_status,\
          working_day_hour, weekoff_day_hour, holiday_hour, working_day_rate , weekoff_day_rate, holiday_rate,\
          payment_type\
          FROM `hims_d_overtime_group` WHERE `record_status`='A' " +
          _stringData +
          " order by hims_d_overtime_group_id desc ",
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
