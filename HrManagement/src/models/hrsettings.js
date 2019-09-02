import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  getEmployeeGroups: (req, res, next) => {
    try {
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
    } catch (e) {
      next(e);
    }
  },

  addEmployeeGroups: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

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
    } catch (e) {
      next(e);
    }
  },

  updateEmployeeGroup: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

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
    } catch (e) {
      next(e);
    }
  },
  getDesignations: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      let strQuery =
        "SELECT hims_d_designation_id, designation_code, designation , created_date FROM `hims_d_designation` \
      WHERE `record_status`='A' order by hims_d_designation_id desc";

      if (req.query.sub_department_id) {
        strQuery = `select hims_d_designation_id,designation_code, designation,D.created_date from hims_d_employee E \
inner join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id \
where E.sub_department_id=${req.query.sub_department_id} group by hims_d_designation_id`;
      }
      _mysql
        .executeQuery({
          query: strQuery,
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
    } catch (e) {
      next(e);
    }
  },

  addDesignation: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

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
    } catch (e) {
      next(e);
    }
  },

  updateDesignation: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

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
    } catch (e) {
      next(e);
    }
  },

  getOvertimeGroups: (req, res, next) => {
    try {
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
    } catch (e) {
      next(e);
    }
  },
  addOvertimeGroups: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_overtime_group (overtime_group_code, overtime_group_description,\
            working_day_hour, weekoff_day_hour, holiday_hour, working_day_rate , weekoff_day_rate, holiday_rate, payment_type,\
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.overtime_group_code,
            input.overtime_group_description,
            input.working_day_hour,
            input.weekoff_day_hour,
            input.holiday_hour,
            input.working_day_rate,
            input.weekoff_day_rate,
            input.holiday_rate,
            input.payment_type,
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
    } catch (e) {
      next(e);
    }
  },

  updateOvertimeGroups: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_overtime_group SET overtime_group_code = ?,\
          overtime_group_description = ?, working_day_hour = ?, weekoff_day_hour = ?, holiday_hour = ? , working_day_rate = ?,\
          weekoff_day_rate = ?, holiday_rate = ?, payment_type = ?, record_status=?,\
            updated_date=?, updated_by=?  WHERE hims_d_overtime_group_id = ?",
          values: [
            input.overtime_group_code,
            input.overtime_group_description,
            input.working_day_hour,
            input.weekoff_day_hour,
            input.holiday_hour,
            input.working_day_rate,
            input.weekoff_day_rate,
            input.holiday_rate,
            input.payment_type,
            input.record_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_overtime_group_id
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
    } catch (e) {
      next(e);
    }
  },

  getDocumentsMaster: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      _mysql
        .executeQuery({
          query:
            "select hims_d_document_type_id, document_type,\
            document_description, arabic_name, document_type_status,record_status, created_date from hims_d_document_type\
         where record_status='A'  order by hims_d_document_type_id desc",
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
    } catch (e) {
      next(e);
    }
  },

  addDocumentType: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_document_type (document_type, document_description,\
              arabic_name, created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?)",
          values: [
            input.document_type,
            input.document_description,
            input.arabic_name,
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
    } catch (e) {
      next(e);
    }
  },

  updateDocumentType: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_document_type SET document_type = ?,\
            document_description = ?, arabic_name = ?, record_status=?,\
            updated_date=?, updated_by=?  WHERE hims_d_document_type_id = ?",
          values: [
            input.document_type,
            input.document_description,
            input.arabic_name,
            input.record_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_document_type_id
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
    } catch (e) {
      next(e);
    }
  },
  getProjects: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      let _strQuery = "";
      if (req.query.pjoject_status != null) {
        _strQuery = " and pjoject_status = '" + req.query.pjoject_status + "'";
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_project_id, project_code,abbreviation,project_desc,project_desc_arabic,\
            start_date, end_date, pjoject_status, inactive_date from hims_d_project\
            where record_status='A'  " +
            _strQuery +
            "order by hims_d_project_id desc",

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
    } catch (e) {
      next(e);
    }
  },

  addProject: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_project(project_code,abbreviation,project_desc,project_desc_arabic,start_date,end_date,\
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.project_code,

            input.abbreviation,
            input.project_desc,
            input.project_desc_arabic,
            input.start_date,
            input.end_date,
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
    } catch (e) {
      next(e);
    }
  },
  updateProjects: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_project SET project_code = ?,abbreviation=?,project_desc = ?, project_desc_arabic = ?, \
            start_date = ?, end_date = ?, pjoject_status = ?, record_status=?\
          ,updated_date=?, updated_by=?  WHERE hims_d_project_id = ?",
          values: [
            input.project_code,
            input.abbreviation,
            input.project_desc,
            input.project_desc_arabic,
            input.start_date,
            input.end_date,
            input.pjoject_status,
            input.record_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_project_id
          ]
        })
        .then(update_project => {
          _mysql.releaseConnection();
          req.records = update_project;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },
  getEmployeeAuthorizationSetup: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let _strAppend = "";
      if (req.query.sub_department_id != null) {
        _strAppend +=
          " and E.sub_department_id='" + req.query.sub_department_id + "'";
      }

      if (req.query.department_id != null) {
        _strAppend += " and SD.department_id='" + req.query.department_id + "'";
      }

      if (req.query.designation_id != null) {
        _strAppend +=
          " and E.employee_designation_id='" + req.query.designation_id + "'";
      }

      _mysql
        .executeQuery({
          query:
            "select E.employee_code, E.full_name, DE.designation,D.department_name, SD.sub_department_name, AUS.employee_id, \
              AUS.leave_level1, AUS.leave_level2, AUS.leave_level3, AUS.loan_level1, AUS.loan_level2, E.reporting_to_id\
              from hims_d_employee E\
              left join hims_d_authorization_setup AUS on AUS.employee_id = E.hims_d_employee_id\
              left join hims_d_sub_department SD on E.sub_department_id = SD.hims_d_sub_department_id \
              left join hims_d_department D on SD.department_id = D.hims_d_department_id \
              left join hims_d_designation DE on E.employee_designation_id = DE.hims_d_designation_id\
              where E.record_status='A' " +
            _strAppend,
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
    } catch (e) {
      next(e);
    }
  },
  //created by :Irfan
  addEmployeeAuthorizationSetup: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      const input = req.body;

      if (input.length > 0) {
        const insurtColumns = [
          "employee_id",
          "leave_level1",
          "leave_level2",
          "leave_level3",
          "loan_level1",
          "loan_level2"
        ];

        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_d_authorization_setup(??) VALUES ? ON DUPLICATE KEY UPDATE \
                        leave_level1=values(leave_level1),leave_level2=values(leave_level2),\
                        leave_level3=values(leave_level3),loan_level1=values(loan_level1),\
                        loan_level2=values(loan_level2) ",
            values: input,
            includeValues: insurtColumns,
            extraValues: {
              created_date: new Date(),
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id
            },
            bulkInsertOrUpdate: true
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
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid input"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  }
};
