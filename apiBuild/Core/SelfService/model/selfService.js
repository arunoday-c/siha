"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to get eployee basic details
var getEmployeeBasicDetails = function getEmployeeBasicDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      connection.query("SELECT E.hims_d_employee_id,E.employee_code,E.title_id,E.full_name,E.arabic_name,E.employee_designation_id,\
         D.designation_code,D.designation,\
            E.license_number,E.sex,E.date_of_birth,E.date_of_joining,E.date_of_resignation,E.present_address,E.present_address2,\
            E.present_pincode,E.present_pincode,E.present_state_id,S.state_name as present_state_name ,E.present_country_id,C.country_name present_country_name,\
            E.permanent_address , E.permanent_address2, E.permanent_pincode, E.permanent_city_id, E.permanent_state_id,\
            E.permanent_country_id, E.primary_contact_no, E.secondary_contact_no,E.email,\
            E.emergency_contact_person,E.emergency_contact_no,E.blood_group,\
            E.isdoctor,E.employee_status,E.exclude_machine_data ,E.company_bank_id ,E.employee_bank_name , E.effective_start_date,E.effective_end_date,\
            E.employee_bank_ifsc_code , E.employee_account_number, E.mode_of_payment, E.accomodation_provided,\
            E.late_coming_rule, E.leave_salary_process, E.entitled_daily_ot, E.suspend_salary, E.gratuity_applicable, E.contract_type, E.employee_group_id,\
            E.weekoff_from,E.overtime_group_id, E.reporting_to_id,REP.full_name as reporting_to_name, E.hospital_id ,\
            H.hospital_code,H.hospital_name ,E.sub_department_id  ,DEP.sub_department_name \
            from hims_d_employee E left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
            left join hims_d_country C on E.present_country_id=C.hims_d_country_id  \
            left join hims_d_state S on  E.present_state_id=S.hims_d_state_id\
            left join hims_d_employee REP on E.reporting_to_id=REP.hims_d_employee_id and REP.record_status='A'\
            left join hims_d_hospital H on  E.hospital_id  =H.hims_d_hospital_id and H.record_status='A'\
            left join hims_d_sub_department DEP on E.sub_department_id=DEP.hims_d_sub_department_id and DEP.record_status='A'\
        where E.record_status='A' and E.hims_d_employee_id=?", req.userIdentity.employee_id, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
var getEmployeeDependentDetails = function getEmployeeDependentDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_employee_id, employee_code, hims_d_employee_dependents_id, ED.dependent_type,ED.dependent_name,\
        ED.dependent_identity_no,ED.dependent_identity_type,ID.identity_document_name\
        from hims_d_employee E left join hims_d_employee_dependents ED on\
        E.hims_d_employee_id=ED.employee_id and ED.record_status='A'\
        left join hims_d_identity_document ID on ED.dependent_identity_type=ID.hims_d_identity_document_id \
        and ID.record_status='A' where E.record_status='A' and E.hims_d_employee_id=?", req.userIdentity.employee_id, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
var getEmployeeIdentificationDetails = function getEmployeeIdentificationDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_employee_id, employee_code,  full_name ,\
        hims_d_employee_identification_id,  identity_documents_id, \
        identity_number, valid_upto, issue_date ,ID.identity_document_name from hims_d_employee E \
        left join hims_d_employee_identification EI on E.hims_d_employee_id=EI.employee_id and  EI.record_status='A'\
        left join hims_d_identity_document ID on EI.identity_documents_id=ID.hims_d_identity_document_id \
        and  ID.record_status='A' where  E.record_status='A' and E.hims_d_employee_id=?", req.userIdentity.employee_id, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var updateEmployeeIdentificationDetails = function updateEmployeeIdentificationDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    if (input.hims_d_employee_identification_id != "null" && input.hims_d_employee_identification_id != undefined) {
      db.getConnection(function (error, connection) {
        if (error) {
          next(error);
        }

        connection.query(" update hims_d_employee_identification set \
        identity_documents_id=?, identity_number=?, valid_upto=?, \
        issue_date=?, alert_required=?, alert_date=?,  updated_date=?, updated_by=?\
        where record_status='A' and hims_d_employee_identification_id=?;", [input.identity_documents_id, input.identity_number, input.valid_upto, input.issue_date, input.alert_required, input.alert_date, new Date(), input.updated_by, input.hims_d_employee_identification_id], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        });
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var updateEmployeeDependentDetails = function updateEmployeeDependentDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    if (input.hims_d_employee_dependents_id != "null" && input.hims_d_employee_dependents_id != undefined) {
      db.getConnection(function (error, connection) {
        if (error) {
          next(error);
        }

        connection.query(" update hims_d_employee_dependents set dependent_type=?,dependent_name=?,\
          dependent_identity_type=?,dependent_identity_no=?, updated_date=?, updated_by=?\
        where record_status='A' and hims_d_employee_dependents_id=?;", [input.dependent_type, input.dependent_name, input.dependent_identity_type, input.dependent_identity_no, new Date(), input.updated_by, input.hims_d_employee_dependents_id], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        });
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var updateEmployeeBasicDetails = function updateEmployeeBasicDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    if (input.hims_d_employee_id != "null" && input.hims_d_employee_id != undefined) {
      db.getConnection(function (error, connection) {
        if (error) {
          next(error);
        }

        connection.query(" update hims_d_employee set full_name=?,arabic_name=?,\
          date_of_birth=?,sex=?,present_address=?,permanent_address=?,primary_contact_no=?,email=?,\
           updated_date=?, updated_by=?\
        where record_status='A' and hims_d_employee_id=?;", [input.full_name, input.arabic_name, input.date_of_birth, input.sex, input.present_address, input.permanent_address, input.primary_contact_no, input.email, new Date(), input.updated_by, input.hims_d_employee_id], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        });
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

var getLeaveMaster = function getLeaveMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    //, , , , , , ,
    //, , , , , , created_by, created_date, updated_date, updated_by, record_status
    db.getConnection(function (error, connection) {
      connection.query("select hims_d_leave_id, leave_code,  leave_description, leave_type, include_weekoff, religion_required\
      include_holiday,  leave_mode, leave_accrual, leave_encash, leave_carry_forward, leave_status, religion_id \
       from hims_d_leave where record_status='A' and leave_status='A'", function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:api to
var addEmployeeDependentDetails = function addEmployeeDependentDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT  INTO hims_d_employee_dependents ( employee_id, dependent_type, dependent_name, \
          dependent_identity_type, dependent_identity_no,\
          created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?)", [input.employee_id, input.dependent_type, input.dependent_name, input.dependent_identity_type, input.dependent_identity_no, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan to delete
var deleteEmployeeDependentDetails = function deleteEmployeeDependentDetails(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var input = (0, _extend2.default)({}, req.body);
    if (input.hims_d_employee_dependents_id != "null" && input.hims_d_employee_dependents_id != undefined) {
      (0, _utils.deleteRecord)({
        db: req.db,
        tableName: "hims_d_employee_dependents",
        id: req.body.hims_d_employee_dependents_id,
        query: "UPDATE hims_d_employee_dependents SET  record_status='I' WHERE  record_status='A' and hims_d_employee_dependents_id=?",
        values: [req.body.hims_d_employee_dependents_id]
      }, function (result) {
        if (result.records.affectedRows > 0) {
          req.records = result;
          next();
        } else {
          req.records = { invalid_input: true };
          next();
        }
      }, function (error) {
        next(error);
      }, true);
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getEmployeeBasicDetails: getEmployeeBasicDetails,
  getEmployeeDependentDetails: getEmployeeDependentDetails,
  getEmployeeIdentificationDetails: getEmployeeIdentificationDetails,
  updateEmployeeIdentificationDetails: updateEmployeeIdentificationDetails,
  updateEmployeeDependentDetails: updateEmployeeDependentDetails,
  updateEmployeeBasicDetails: updateEmployeeBasicDetails,
  getLeaveMaster: getLeaveMaster,
  addEmployeeDependentDetails: addEmployeeDependentDetails,
  deleteEmployeeDependentDetails: deleteEmployeeDependentDetails
};
//# sourceMappingURL=selfService.js.map