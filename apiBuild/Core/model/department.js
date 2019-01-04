"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add departments
var addDepartment = function addDepartment(req, res, next) {
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

      connection.query("INSERT INTO `hims_d_department` (department_code,department_name,arabic_department_name,\
          department_desc,department_type,effective_start_date,effective_end_date,created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?)", [input.department_code, input.department_name, input.arabic_department_name, input.department_desc, input.department_type, input.effective_start_date, input.effective_end_date, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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
// import $ from "jquery";


var updateDepartment = function updateDepartment(req, res, next) {
  try {
    (0, _logging.debugFunction)("updateDepartment");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input Data", req.body);
    var departmentDetails = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        var queryBuilder = "UPDATE `hims_d_department`\
        SET   `department_name`=?, `department_desc`=?, `department_type`=?\
        , `effective_start_date`=?, `effective_end_date`=? \
        ,`arabic_department_name`=?, `updated_date`=?, `updated_by`=?\
        WHERE record_status='A' AND `hims_d_department_id`=?;";
        var inputs = [departmentDetails.department_name, departmentDetails.department_desc, departmentDetails.department_type, departmentDetails.effective_start_date, departmentDetails.effective_end_date, departmentDetails.arabic_department_name, new Date(), departmentDetails.updated_by, departmentDetails.hims_d_department_id];

        connection.query(queryBuilder, inputs, function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          connection.commit(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            req.records = result;
            next();
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
var deleteDepartment = function deleteDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_department",
      id: req.body.hims_d_department_id,
      query: "UPDATE hims_d_department SET  record_status='I' WHERE hims_d_department_id=?",
      values: [req.body.hims_d_department_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Departments
var selectDepartment = function selectDepartment(req, res, next) {
  var selectWhere = {
    hims_d_department_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_department_id, department_code, department_name, arabic_department_name,\
        department_desc, department_type, effective_start_date, effective_end_date, department_status\
        from hims_d_department where record_status='A' AND " + where.condition + " order by hims_d_department_id desc", where.values, function (error, result) {
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

//created by irfan: to get SUB-Departments
var selectSubDepartment = function selectSubDepartment(req, res, next) {
  var selectWhere = {
    department_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_sub_department_id, sub_department_code, sub_department_name, arabic_sub_department_name,\
        sub_department_desc, department_id, effective_start_date, effective_end_date, sub_department_status\
        from  hims_d_sub_department where record_status='A' and " + where.condition + " order by hims_d_sub_department_id desc", where.values, function (error, result) {
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

//created by irfan: to add  SUB_departments
var addSubDepartment = function addSubDepartment(req, res, next) {
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

      connection.query("INSERT INTO `hims_d_sub_department` (sub_department_code,sub_department_name,\
          arabic_sub_department_name,sub_department_desc,department_id,effective_start_date,\
          effective_end_date,created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?)", [input.sub_department_code, input.sub_department_name, input.arabic_sub_department_name, input.sub_department_desc, input.department_id, input.effective_start_date, input.effective_end_date, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

var updateSubDepartment = function updateSubDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var subDepartmentDetails = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_sub_department`\
   SET `sub_department_name`=?, `sub_department_desc`=?,arabic_sub_department_name=?\
   , `effective_start_date`=?, `effective_end_date`=? \
   ,`updated_date`=?, `updated_by`=?\
   WHERE `record_status`='A' AND `hims_d_sub_department_id`=? ;", [subDepartmentDetails.sub_department_name, subDepartmentDetails.sub_department_desc, subDepartmentDetails.arabic_sub_department_name, subDepartmentDetails.effective_start_date, subDepartmentDetails.effective_end_date, new Date(), subDepartmentDetails.updated_by, subDepartmentDetails.hims_d_sub_department_id], function (error, result) {
        connection.release();
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

//created by:Noor to get sub departments
var selectdoctors = function selectdoctors(req, res, next) {
  var inputClicnicalNonClinicalDept = {
    department_type: "ALL"
  };
  (0, _logging.debugFunction)("selectdoctors");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _extend2.default)(inputClicnicalNonClinicalDept, req.query);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var connectionString = "";
      if (where.department_type == "CLINICAL") {
        connectionString = " and hims_d_department.department_type='CLINICAL' ";
      } else if (where.department_type == "NON-CLINICAL") {
        connectionString = " and hims_d_department.department_type='NON-CLINICAL' ";
      }

      // connection.query(
      //   "select hims_d_sub_department.hims_d_sub_department_id ,sub_department_code,sub_department_name\
      //    ,sub_department_desc, arabic_sub_department_name, hims_d_sub_department.department_id,hims_d_department.department_type \
      //    from hims_d_sub_department,hims_d_department where \
      //    hims_d_sub_department.department_id=hims_d_department.hims_d_department_id \
      //    and hims_d_department.record_status='A' and sub_department_status='A' \
      //    " +
      //     connectionString,
      //   (error, result) => {
      //     if (error) {
      //       connection.release();
      //       next(error);
      //     }
      //     // req.records = result;
      //     //sbdepartment = extend(sbdepartment, result.body);
      //     // console.log(sbdepartment);
      //     //next();
      //   }
      // );

      connection.query("select hims_m_employee_department_mappings.employee_id,\
         hims_m_employee_department_mappings.sub_department_id,\
      hims_d_employee.full_name,\
      hims_d_employee.arabic_name,\
      hims_m_employee_department_mappings.services_id,\
      hims_d_sub_department.department_id,\
      hims_d_sub_department.sub_department_name,\
      hims_d_sub_department.arabic_sub_department_name,\
      hims_d_sub_department.department_type\
      from hims_m_employee_department_mappings,\
      hims_d_employee,hims_d_sub_department,hims_d_department,\
      hims_d_employee_category,hims_m_category_speciality_mappings\
      where\
      hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      and hims_m_employee_department_mappings.employee_id = hims_d_employee.hims_d_employee_id \
      and hims_d_sub_department.hims_d_sub_department_id= hims_m_employee_department_mappings.sub_department_id\
      and hims_m_employee_department_mappings.record_status='A'\
      and hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      and hims_d_sub_department.record_status='A'\
      and hims_d_employee.record_status ='A'\
      and hims_d_sub_department.sub_department_status='A'\
      and hims_d_employee.employee_status='A'\
      and hims_d_department.department_type='CLINICAL'\
      and hims_d_employee.isdoctor='Y'\
      group by hims_m_employee_department_mappings.employee_id,hims_m_employee_department_mappings.sub_department_id;", function (error, results) {
        connection.release();
        if (error) {
          next(error);
        }

        var departments = new _nodeLinq.LINQ(results).GroupBy(function (g) {
          return g.sub_department_id;
        });
        var doctors = new _nodeLinq.LINQ(results).GroupBy(function (g) {
          return g.employee_id;
        });
        // .SelectMany(s => {
        //   return s;
        // })
        // .ToArray();
        // .Select(s => {
        //   debugLog("log of ", s);
        //   return {
        //     sub_department_id: s.sub_department_id,
        //     sub_department_name: s.sub_department_name,
        //     employee_id: s.employee_id
        //   };
        // });
        //.ToArray();

        req.records = { departments: departments, doctors: doctors };
        //extend(sbdepartment, doctorsInfo);
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan to get sub departments doctors and clinic
var selectDoctorsAndClinic = function selectDoctorsAndClinic(req, res, next) {
  var inputClicnicalNonClinicalDept = {
    department_type: "ALL"
  };
  (0, _logging.debugFunction)("selectdoctors");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _extend2.default)(inputClicnicalNonClinicalDept, req.query);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var connectionString = "";
      if (where.department_type == "CLINICAL") {
        connectionString = " and hims_d_department.department_type='CLINICAL' ";
      } else if (where.department_type == "NON-CLINICAL") {
        connectionString = " and hims_d_department.department_type='NON-CLINICAL' ";
      }

      connection.query("select hims_m_employee_department_mappings.employee_id as provider_id,\
         hims_m_employee_department_mappings.sub_department_id as sub_dept_id,\
       hims_d_employee.full_name,\
  hims_d_employee.arabic_name,\
      hims_m_employee_department_mappings.services_id,\
      hims_d_sub_department.department_id,\
      hims_d_sub_department.sub_department_name,\
      hims_d_sub_department.arabic_sub_department_name,hims_d_appointment_clinic_id as clinic_id,AP.description as clinic_description\
      from hims_m_employee_department_mappings,\
      hims_d_employee,hims_d_sub_department,hims_d_department,\
      hims_d_employee_category,hims_m_category_speciality_mappings,hims_d_appointment_clinic AP\
      where\
      hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      and hims_m_employee_department_mappings.employee_id = hims_d_employee.hims_d_employee_id \
      and hims_d_sub_department.hims_d_sub_department_id= hims_m_employee_department_mappings.sub_department_id\
      and hims_m_employee_department_mappings.record_status='A'\
      and hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      and hims_d_sub_department.record_status='A'\
      and hims_d_employee.record_status ='A'\
      and hims_d_sub_department.sub_department_status='A'\
      and hims_d_employee.employee_status='A'\
      and hims_d_department.department_type='CLINICAL'\
      and hims_d_employee.isdoctor='Y'\
      and AP.record_status='A' and hims_d_employee.hims_d_employee_id=AP.provider_id \
      group by hims_m_employee_department_mappings.employee_id,hims_m_employee_department_mappings.sub_department_id;", function (error, results) {
        connection.release();
        if (error) {
          next(error);
        }

        var departments = new _nodeLinq.LINQ(results).GroupBy(function (g) {
          return g.sub_dept_id;
        });
        var doctors = new _nodeLinq.LINQ(results).GroupBy(function (g) {
          return g.provider_id;
        });
        // .SelectMany(s => {
        //   return s;
        // })
        // .ToArray();
        // .Select(s => {
        //   debugLog("log of ", s);
        //   return {
        //     sub_department_id: s.sub_department_id,
        //     sub_department_name: s.sub_department_name,
        //     employee_id: s.employee_id
        //   };
        // });
        //.ToArray();

        req.records = { departments: departments, doctors: doctors };
        //extend(sbdepartment, doctorsInfo);
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan to delete sub department
var deleteSubDepartment = function deleteSubDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_sub_department",
      id: req.body.hims_d_sub_department_id,
      query: "UPDATE hims_d_sub_department SET  record_status='I' WHERE hims_d_sub_department_id=?",
      values: [req.body.hims_d_sub_department_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by:irfan to makeSubDepartmentInActive
var makeSubDepartmentInActive = function makeSubDepartmentInActive(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_sub_department",
      id: req.body.hims_d_sub_department_id,
      query: "UPDATE hims_d_sub_department SET  sub_department_status='I' WHERE hims_d_sub_department_id=?",
      values: [req.body.hims_d_sub_department_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by:irfan to makeDepartmentInActive
var makeDepartmentInActive = function makeDepartmentInActive(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_department",
      id: req.body.hims_d_department_id,
      query: "UPDATE hims_d_department SET  department_status='I' WHERE hims_d_department_id=?",
      values: [req.body.hims_d_department_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addDepartment: addDepartment,
  updateDepartment: updateDepartment,
  selectDepartment: selectDepartment,
  selectSubDepartment: selectSubDepartment,
  addSubDepartment: addSubDepartment,
  updateSubDepartment: updateSubDepartment,
  deleteDepartment: deleteDepartment,
  selectdoctors: selectdoctors,
  selectDoctorsAndClinic: selectDoctorsAndClinic,
  deleteSubDepartment: deleteSubDepartment,
  makeSubDepartmentInActive: makeSubDepartmentInActive,
  makeDepartmentInActive: makeDepartmentInActive
};
//# sourceMappingURL=department.js.map