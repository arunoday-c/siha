"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var department = {
  hims_d_department_id: null,
  department_code: null,
  department_name: null,
  department_desc: null,
  department_type: null,
  hospital_id: null,
  effective_start_date: null,
  effective_end_date: null,
  department_status: null,
  created_date: null,
  created_by: null,
  updated_date: null,
  updated_by: null,
  record_status: null,
  sub_department: [subDepartment]
};
var subDepartment = {
  hims_d_sub_department_id: null,
  sub_department_code: null,
  sub_department_name: null,
  sub_department_desc: null,
  department_id: null,
  effective_start_date: null,
  effective_end_date: null,
  sub_department_status: null,
  created_date: null,
  created_by: null,
  updated_date: null,
  updated_by: null,
  record_status: null
};
var addDepartment = function addDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var departmentDetails = (0, _extend2.default)(department, req.body);
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
        connection.query("INSERT INTO hims_d_department(department_code \
        ,department_name \
        ,department_desc \
        ,department_type \
        ,hospital_id \
        ,effective_start_date \
        ,effective_end_date \
        ,department_status \
        ,created_date \
        ,created_by \
        ) VALUE(?,?,?,?,?,?,?,?,?,?)", [departmentDetails.department_code, departmentDetails.department_name, departmentDetails.department_desc, departmentDetails.department_type, departmentDetails.hospital_id, departmentDetails.effective_start_date, departmentDetails.effective_end_date, departmentDetails.department_status, new Date(), departmentDetails.created_by], function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          if (result != null) {
            departmentDetails.hims_d_department_id = result.insertId;

            connection.commit(function (error) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
              connection.query("SELECT `hims_d_department_id`, `department_code`\
            , `department_name`, `department_desc`, `department_type`, `hospital_id`\
            , `effective_start_date`, `effective_end_date`, `department_status`\
             FROM `hims_d_department` WHERE hims_d_department_id=?;\
             SELECT `hims_d_sub_department_id`, `sub_department_code`, `sub_department_name`\
             ,`sub_department_desc`, `department_id`, `effective_start_date`\
             , `effective_end_date`, `sub_department_status` FROM `hims_d_sub_department` WHERE department_id=?;", [departmentDetails.hims_d_department_id, departmentDetails.hims_d_department_id], function (error, resultTables) {
                (0, _utils.releaseDBConnection)(db, connection);
                if (error) {
                  next(error);
                }
                req.records = resultTables;
                next();
              });
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
var updateDepartment = function updateDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var departmentDetails = (0, _extend2.default)(department, req.body);
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
      ,`hospital_id`=?, `effective_start_date`=?, `effective_end_date`=? \
      ,`department_status`=?, `updated_date`=?, `updated_by`=?\
      WHERE record_status='A' AND `hims_d_department_id`=?;";
        var inputs = [departmentDetails.department_name, departmentDetails.department_desc, departmentDetails.department_type, departmentDetails.hospital_id, departmentDetails.effective_start_date, departmentDetails.effective_end_date, department.department_status, new Date(), departmentDetails.updated_by, departmentDetails.hims_d_department_id];

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
            connection.query("SELECT `hims_d_department_id`, `department_code`\
        , `department_name`, `department_desc`, `department_type`, `hospital_id`\
        , `effective_start_date`, `effective_end_date`, `department_status`\
         FROM `hims_d_department` WHERE hims_d_department_id=?;", [departmentDetails.hims_d_department_id], function (error, resultSelect) {
              (0, _utils.releaseDBConnection)(db, connection);

              if (error) {
                next(error);
              }
              req.records = resultSelect;
              next();
            });
          });
        });
      });
    });
  } catch (e) {
    next(error);
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
    });
  } catch (e) {
    next(e);
  }
};

var departWhereCondition = {
  department_code: "ALL",
  department_name: "ALL",
  department_desc: "ALL",
  department_type: "ALL",
  effective_start_date: "ALL",
  effective_end_date: "ALL",
  department_status: "ALL"
};

var selectDepartment = function selectDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = (0, _utils.paging)(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(departWhereCondition, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT `hims_d_department_id`, `department_code`, `department_name`\
    , `department_desc`, `department_type`, `hospital_id`, `effective_start_date`\
    , `effective_end_date`, `department_status`,`created_date` FROM `hims_d_department` WHERE record_status ='A' AND " + condition.condition + " " + pagePaging,
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

var subDepartmentWhereCondition = {
  hims_d_sub_department_id: "ALL",
  sub_department_code: "ALL",
  sub_department_name: "ALL",
  sub_department_desc: "ALL",
  department_id: "ALL",
  effective_start_date: "ALL",
  effective_end_date: "ALL",
  sub_department_status: "ALL"
};

var selectSubDepartment = function selectSubDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var condition = (0, _utils.whereCondition)((0, _extend2.default)(subDepartmentWhereCondition, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT `hims_d_sub_department_id`, `sub_department_code`\
        , `sub_department_name`, `sub_department_desc`, `department_id`\
        , `effective_start_date`, `effective_end_date`, `sub_department_status`\
         FROM `hims_d_sub_department` WHERE record_status ='A' AND " + condition.condition,
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

var addSubDepartment = function addSubDepartment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var subDepartmentDetails = (0, _extend2.default)(subDepartment, req.body);
    ///1
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      //2
      connection.query("SELECT hims_d_department_id from hims_d_department where hims_d_department_id =?", [subDepartmentDetails.department_id], function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        if (result.length != 0) {
          connection.query("INSERT INTO hims_d_sub_department(`sub_department_code`\
        , `sub_department_name`\
        , `sub_department_desc`\
        , `department_id`\
        , `effective_start_date`\
        , `effective_end_date`\
        , `sub_department_status`\
        , `created_date`\
        , `created_by`)VALUE(?,?,?,?,?,?,?,?,?)", [subDepartmentDetails.sub_department_code, subDepartmentDetails.sub_department_name, subDepartmentDetails.sub_department_desc, subDepartmentDetails.department_id, subDepartmentDetails.effective_start_date, subDepartmentDetails.effective_end_date, subDepartmentDetails.sub_department_status, new Date(), subDepartmentDetails.created_by], function (error, resdata) {
            (0, _utils.releaseDBConnection)(db, connection);
            if (error) {
              next(error);
            }
            req.records = resdata;
            next();
          });
        } else {
          next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No such deparment exists"));
        }
      });
    });
    //3
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
    var subDepartmentDetails = (0, _extend2.default)(subDepartment, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("UPDATE `hims_d_sub_department`\
   SET `sub_department_name`=?, `sub_department_desc`=?\
   , `effective_start_date`=?, `effective_end_date`=? \
   , `sub_department_status`=?,`updated_date`=?, `updated_by`=?\
   WHERE `record_status`='A' AND `hims_d_sub_department_id`=? ;", [subDepartmentDetails.sub_department_name, subDepartmentDetails.sub_department_desc, subDepartmentDetails.effective_start_date, subDepartmentDetails.effective_end_date, subDepartmentDetails.sub_department_status, new Date(), subDepartmentDetails.updated_by, subDepartmentDetails.hims_d_sub_department_id], function (error, result) {
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

module.exports = {
  addDepartment: addDepartment,
  updateDepartment: updateDepartment,
  selectDepartment: selectDepartment,
  selectSubDepartment: selectSubDepartment,
  addSubDepartment: addSubDepartment,
  updateSubDepartment: updateSubDepartment,
  deleteDepartment: deleteDepartment
};
//# sourceMappingURL=department.js.map