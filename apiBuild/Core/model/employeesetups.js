"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDesignations = function getDesignations(req, res, next) {
  var desgn = {
    hims_d_designation_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(desgn, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT hims_d_designation_id, designation_code, designation FROM `hims_d_designation` WHERE `record_status`='A' AND " + condition.condition + " " + pagePaging,
      values: condition.values
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
//created by irfan:api to
var addDesignation = function addDesignation(req, res, next) {
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

      connection.query("INSERT  INTO hims_d_designation (designation_code, designation, \
          created_date,created_by,updated_date,updated_by) values(\
          ?,?,?,?,?,?)", [input.designation_code, input.designation, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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
var deleteDesignation = function deleteDesignation(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var input = (0, _extend2.default)({}, req.body);
    if (input.hims_d_designation_id != "null" && input.hims_d_designation_id != undefined) {
      (0, _utils.deleteRecord)({
        db: req.db,
        tableName: "hims_d_designation",
        id: req.body.hims_d_designation_id,
        query: "UPDATE hims_d_designation SET  record_status='I' WHERE hims_d_designation_id=?",
        values: [req.body.hims_d_designation_id]
      }, function (result) {
        if (result.records.affectedRows > 0) {
          (0, _logging.debugLog)("result", result);
          req.records = result;
          next();
        } else {
          req.records = { invalid_input: true };

          (0, _logging.debugLog)("els");
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
var getEmpSpeciality = function getEmpSpeciality(req, res, next) {
  var select = {
    hims_d_employee_speciality_id: "ALL",
    sub_department_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(select, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT hims_d_employee_speciality_id, sub_department_id, speciality_code, speciality_name, \
          arabic_name, speciality_desc, speciality_status FROM `hims_d_employee_speciality` WHERE `record_status`='A' AND " + condition.condition + " order by hims_d_employee_speciality_id desc ",
      values: condition.values
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

var getEmpCategory = function getEmpCategory(req, res, next) {
  var select = {
    hims_employee_category_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(select, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT hims_employee_category_id, employee_category_code, employee_category_name, arabic_name,\
           employee_category_desc, employee_category_status\
          FROM `hims_d_employee_category` WHERE `record_status`='A' AND " + condition.condition + " order by hims_employee_category_id desc ",
      values: condition.values
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

//created by adnan to get overtime groups
var getOvertimeGroups = function getOvertimeGroups(req, res, next) {
  var select = {
    hims_d_overtime_group_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(select, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT hims_d_overtime_group_id, overtime_group_code, overtime_group_description, overtime_group_status,\
          working_day_hour, weekoff_day_hour, holiday_hour, working_day_rate , weekoff_day_rate, holiday_rate,\
          payment_type\
          FROM `hims_d_overtime_group` WHERE `record_status`='A' AND " + condition.condition + " order by hims_d_overtime_group_id desc ",
      values: condition.values
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

//created by adnan to add overtime groups
var addOvertimeGroups = function addOvertimeGroups(req, res, next) {
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

      connection.query("INSERT  INTO hims_d_overtime_group (overtime_group_code, overtime_group_description,\
          working_day_hour, weekoff_day_hour, holiday_hour, working_day_rate , weekoff_day_rate, holiday_rate, payment_type,\
          created_date,created_by,updated_date,updated_by) values(\
          ?,?,?,?,?,?,?,?,?,?,?,?,?)", [input.overtime_group_code, input.overtime_group_description, input.working_day_hour, input.weekoff_day_hour, input.holiday_hour, input.working_day_rate, input.weekoff_day_rate, input.holiday_rate, input.payment_type, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by adnan to delete overtime groups
var deleteOvertimeGroups = function deleteOvertimeGroups(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var input = (0, _extend2.default)({}, req.body);
    if (input.hims_d_overtime_group_id != "null" && input.hims_d_overtime_group_id != undefined) {
      (0, _utils.deleteRecord)({
        db: req.db,
        tableName: "hims_d_overtime_group",
        id: req.body.hims_d_overtime_group_id,
        query: "UPDATE hims_d_overtime_group SET  record_status='I' WHERE hims_d_overtime_group_id=?",
        values: [req.body.hims_d_overtime_group_id]
      }, function (result) {
        if (result.records.affectedRows > 0) {
          (0, _logging.debugLog)("result", result);
          req.records = result;
          next();
        } else {
          req.records = { invalid_input: true };

          (0, _logging.debugLog)("els");
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

var updateOvertimeGroups = function updateOvertimeGroups(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var input = (0, _extend2.default)({}, req.body);

    if (input.hims_d_overtime_group_id != "null" && input.hims_d_overtime_group_id != undefined) {
      db.getConnection(function (error, connection) {
        connection.query("UPDATE hims_d_overtime_group SET overtime_group_code = ?,\
          overtime_group_description = ?, working_day_hour = ?, weekoff_day_hour = ?, holiday_hour = ? , working_day_rate = ?,\
          weekoff_day_rate = ?, holiday_rate = ?, payment_type = ?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_overtime_group_id = ?", [input.overtime_group_code, input.overtime_group_description, input.working_day_hour, input.weekoff_day_hour, input.holiday_hour, input.working_day_rate, input.weekoff_day_rate, input.holiday_rate, input.payment_type, new Date(), input.updated_by, input.hims_d_overtime_group_id], function (error, result) {
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

module.exports = {
  getDesignations: getDesignations,
  getEmpSpeciality: getEmpSpeciality,
  getEmpCategory: getEmpCategory,
  addDesignation: addDesignation,
  deleteDesignation: deleteDesignation,
  getOvertimeGroups: getOvertimeGroups,
  addOvertimeGroups: addOvertimeGroups,
  deleteOvertimeGroups: deleteOvertimeGroups,
  updateOvertimeGroups: updateOvertimeGroups
};
//# sourceMappingURL=employeesetups.js.map