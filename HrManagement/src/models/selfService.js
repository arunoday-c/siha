import algaehMysql from "algaeh-mysql";
import _ from "lodash";
// import moment from "moment";
// import { LINQ } from "node-linq";

module.exports = {
  getLeaveMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        _mysql
          .executeQuery({
            query:
              "select hims_d_leave_id, leave_code,  leave_description, leave_category, calculation_type,\
                leave_type, include_weekoff, encashment_percentage, religion_required,\
            include_holiday, holiday_reimbursement,  leave_mode, leave_accrual, leave_encash, leave_carry_forward,\
            exit_permit_required,  proportionate_leave, document_mandatory, carry_forward_percentage,\
              leave_status, religion_id , religion_required \
              from hims_d_leave where record_status='A' and leave_status='A'",
            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeBasicDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        _mysql
          .executeQuery({
            query:
              "SELECT E.hims_d_employee_id,E.employee_code,E.title_id,E.full_name,E.arabic_name,E.religion_id,E.employee_designation_id,\
            D.designation_code,D.designation,\
               E.license_number,E.sex,E.date_of_birth,E.date_of_joining,E.date_of_resignation,E.present_address,E.present_address2,\
               E.present_pincode,E.present_pincode,E.present_city_id,CITY.city_name as present_city_name ,\
               E.present_state_id,S.state_name as present_state_name ,\
               E.present_country_id,C.country_name present_country_name,\
               E.permanent_address , E.permanent_address2, E.permanent_pincode, E.permanent_city_id, E.permanent_state_id,\
               E.permanent_country_id, E.primary_contact_no, E.secondary_contact_no,E.email,\
               E.emergency_contact_person,E.emergency_contact_no,E.blood_group,\
               E.isdoctor,E.employee_status,E.exclude_machine_data ,E.company_bank_id ,E.employee_bank_name ,\
                E.effective_start_date,E.effective_end_date, E.employee_bank_ifsc_code ,\
                 E.employee_account_number, E.mode_of_payment, E.accomodation_provided,\
               E.late_coming_rule, E.leave_salary_process, E.entitled_daily_ot,\
                E.suspend_salary, E.gratuity_applicable, E.contract_type, E.employee_group_id,\
               E.weekoff_from,E.overtime_group_id, E.reporting_to_id,REP.full_name as reporting_to_name,\
                E.hospital_id ,E.employee_type, H.hospital_code,H.hospital_name ,E.sub_department_id ,\
                DEP.sub_department_name  from hims_d_employee E left join hims_d_designation D\
                 on E.employee_designation_id=D.hims_d_designation_id  left join hims_d_country C on\
                  E.present_country_id=C.hims_d_country_id   left join hims_d_city CITY on\
                   E.present_city_id=CITY.hims_d_city_id left join hims_d_state S on \
             E.present_state_id=S.hims_d_state_id left join hims_d_employee REP on\
            E.reporting_to_id=REP.hims_d_employee_id and REP.record_status='A'\
              left join hims_d_hospital H on  E.hospital_id  =H.hims_d_hospital_id and H.record_status='A'\
               left join hims_d_sub_department DEP on E.sub_department_id=DEP.hims_d_sub_department_id and DEP.record_status='A'\
           where E.record_status='A'  and E.hims_d_employee_id=?",
            values: [req.userIdentity.employee_id],
            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeDependentDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        _mysql
          .executeQuery({
            query:
              "select hims_d_employee_id, employee_code, hims_d_employee_dependents_id, ED.dependent_type,ED.dependent_name,\
            ED.dependent_identity_no,ED.dependent_identity_type,ID.identity_document_name\
            from hims_d_employee E left join hims_d_employee_dependents ED on\
            E.hims_d_employee_id=ED.employee_id and ED.record_status='A'\
            left join hims_d_identity_document ID on ED.dependent_identity_type=ID.hims_d_identity_document_id \
            and ID.record_status='A' where E.record_status='A' and E.hims_d_employee_id=?",
            values: [req.userIdentity.employee_id],
            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeIdentificationDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        _mysql
          .executeQuery({
            query:
              "select hims_d_employee_id, employee_code,  full_name ,\
            hims_d_employee_identification_id,  identity_documents_id, \
            identity_number, valid_upto, issue_date ,ID.identity_document_name from hims_d_employee E \
            left join hims_d_employee_identification EI on E.hims_d_employee_id=EI.employee_id and  EI.record_status='A'\
            left join hims_d_identity_document ID on EI.identity_documents_id=ID.hims_d_identity_document_id \
            and  ID.record_status='A' where  E.record_status='A' and E.hims_d_employee_id=?",
            values: [req.userIdentity.employee_id],
            printQuery: false
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  updateEmployeeIdentificationDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "update hims_d_employee_identification set \
            identity_documents_id=?, identity_number=?, valid_upto=?, \
            issue_date=?, alert_required=?, alert_date=?,  updated_date=?, updated_by=?\
            where record_status='A' and hims_d_employee_identification_id=?;",
        values: [
          input.identity_documents_id,
          input.identity_number,
          input.valid_upto,
          input.issue_date,
          input.alert_required,
          input.alert_date,
          new Date(),
          input.updated_by,
          input.hims_d_employee_identification_id
        ],
        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },
  updateEmployeeDependentDetails: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "update hims_d_employee_dependents set dependent_type=?,dependent_name=?,\
               dependent_identity_type=?,dependent_identity_no=?, updated_date=?, updated_by=?\
                where record_status='A' and hims_d_employee_dependents_id=?;",
        values: [
          input.dependent_type,
          input.dependent_name,
          input.dependent_identity_type,
          input.dependent_identity_no,
          new Date(),
          input.updated_by,
          input.hims_d_employee_dependents_id
        ],
        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;

        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },

  updateEmployeeBasicDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "update hims_d_employee set full_name=?,arabic_name=?,\
            date_of_birth=?,sex=?,present_address=?,permanent_address=?,primary_contact_no=?,email=?,\
             updated_date=?, updated_by=?\
          where record_status='A' and hims_d_employee_id=?;",
        values: [
          input.full_name,
          input.arabic_name,
          input.date_of_birth,
          input.sex,
          input.present_address,
          input.permanent_address,
          input.primary_contact_no,
          input.email,
          new Date(),
          input.updated_by,
          input.hims_d_employee_id
        ],
        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },

  addEmployeeDependentDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "INSERT  INTO hims_d_employee_dependents ( employee_id, dependent_type, dependent_name, \
                dependent_identity_type, dependent_identity_no,\
                created_date,created_by,updated_date,updated_by) values(\
                  ?,?,?,?,?,?,?,?,?)",
        values: [
          input.employee_id,
          input.dependent_type,
          input.dependent_name,
          input.dependent_identity_type,
          input.dependent_identity_no,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  },

  getEmployeeAdvance: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      const input = req.query;

      let inputValues = [];
      let _stringData = "";
      if (input.employee_id != null) {
        _stringData += " and employee_id=?";
        inputValues.push(input.employee_id);
      }

      _mysql
        .executeQuery({
          query:
            "Select hims_f_employee_advance_id, advance_number,employee_id, advance_amount, advance_reason, \
          deducting_month,deducting_year, advance_status, created_by, created_date, updated_by, updated_date \
          from hims_f_employee_advance where record_status='A' " +
            _stringData,
          values: inputValues,
          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          resolve(result);
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addEmployeeAdvance: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .generateRunningNumber({
        modules: ["EMPLOYEE_ADVANCE"],
        tableName: "hims_f_app_numgen",
        identity: {
          algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
          hospital_id: req.userIdentity["x-branch"]
        }
      })
      .then(generatedNumbers => {
        _mysql
          .executeQuery({
            query:
              "INSERT  INTO `hims_f_employee_advance` (advance_number, employee_id,advance_amount, deducting_month,\
                deducting_year, advance_reason,created_date,created_by,updated_date,updated_by)\
                VALUE(?,?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers[0],
              input.employee_id,
              input.advance_amount,
              input.deducting_month,
              input.deducting_year,
              input.advance_reason,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ],
            printQuery: false
          })
          .then(employee_advance => {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = employee_advance;

              next();
            });
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  addEmployeeIdentification: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "INSERT  INTO hims_d_employee_identification (employee_id,identity_documents_id,\
              identity_number,valid_upto,issue_date,alert_required,alert_date,\
              created_date,created_by,updated_date,updated_by) values(\
                ?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.employee_id,
          input.identity_documents_id,
          input.identity_number,
          input.valid_upto,
          input.issue_date,
          input.alert_required,
          input.alert_date,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        printQuery: false
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  }

  //TODO
  //DELETE API IN MICRO SERVICE(TASK DUE NOOR MOHSIN)

  //   deleteEmployeeDependentDetails: (req, res, next) => {
  //     return new Promise((resolve, reject) => {
  //       const _mysql = new algaehMysql();
  //       try {
  //         _mysql
  //           .executeQuery({
  //             query:
  //               "INSERT  INTO hims_d_employee_dependents ( employee_id, dependent_type, dependent_name, \
  //                 dependent_identity_type, dependent_identity_no,\
  //                 created_date,created_by,updated_date,updated_by) values(\
  //                   ?,?,?,?,?,?,?,?,?)",
  //             values: [
  //               input.employee_id,
  //               input.dependent_type,
  //               input.dependent_name,
  //               input.dependent_identity_type,
  //               input.dependent_identity_no,
  //               new Date(),
  //               input.created_by,
  //               new Date(),
  //               input.updated_by
  //             ],
  //             printQuery: false
  //           })
  //           .then(result => {
  //             _mysql.releaseConnection();
  //             req.records = result;
  //             resolve(result);
  //             next();
  //           })
  //           .catch(error => {
  //             _mysql.releaseConnection();
  //             reject(error);
  //             next(error);
  //           });
  //       } catch (e) {
  //         _mysql.releaseConnection();
  //         next(e);
  //       }
  //     }).catch(e => {
  //       _mysql.releaseConnection();
  //       next(e);
  //     });
  //   }
};
