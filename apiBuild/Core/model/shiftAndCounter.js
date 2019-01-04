"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add shift master
var addShiftMaster = function addShiftMaster(req, res, next) {
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

      connection.query("INSERT INTO `hims_d_shift` (shift_code,shift_description,arabic_name,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)", [input.shift_code, input.shift_description, input.arabic_name, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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
//created by irfan: to addCounterMaster
var addCounterMaster = function addCounterMaster(req, res, next) {
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

      connection.query("INSERT INTO `hims_d_counter` (counter_code,counter_description,arabic_name,     created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)", [input.counter_code, input.counter_description, input.arabic_name, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to getCounterMaster
var getCounterMaster = function getCounterMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_counter_id,counter_code,counter_description,arabic_name,counter_status from \
          hims_d_counter where record_status='A' order by hims_d_counter_id desc;", function (error, result) {
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

//created by irfan: to getShiftMaster
var getShiftMaster = function getShiftMaster(req, res, next) {
  var selectWhere = {
    hims_d_shift_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
    db.getConnection(function (error, connection) {
      connection.query("select hims_d_shift_id, shift_code, shift_description, arabic_name, shift_status from \
          hims_d_shift where record_status='A' and " + where.condition + " order by hims_d_shift_id desc", where.values, function (error, result) {
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

//created by irfan: to updateShiftMaster
var updateShiftMaster = function updateShiftMaster(req, res, next) {
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
      connection.query("UPDATE `hims_d_shift` SET shift_code=?, shift_description=?, arabic_name=?, shift_status=?,\
             updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_shift_id`=?;", [input.shift_code, input.shift_description, input.arabic_name, input.shift_status, new Date(), input.updated_by, input.record_status, input.hims_d_shift_id], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  updateCounterMaster
var updateCounterMaster = function updateCounterMaster(req, res, next) {
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
      connection.query("UPDATE `hims_d_counter` SET counter_code=?, counter_description=?, arabic_name=?, counter_status=?,\
             updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_counter_id`=?;", [input.counter_code, input.counter_description, input.arabic_name, input.counter_status, new Date(), input.updated_by, input.record_status, input.hims_d_counter_id], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var getCashiers = function getCashiers(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // select algaeh_d_app_group_id,EDM.user_id as cashier_id,G.group_type,hims_d_employee_id,\
    // employee_code,E.full_name as cashier_name from algaeh_d_app_group G \
    // inner join algaeh_m_group_user_mappings GUP\
    // on G.algaeh_d_app_group_id=GUP.app_group_id \
    // inner join hims_m_employee_department_mappings EDM on GUP.user_id=EDM.user_id\
    // inner join hims_d_employee  E on EDM.employee_id=E.hims_d_employee_id\
    // where group_type in('C','FD') order by cashier_id desc;
    db.getConnection(function (error, connection) {
      if (req.userIdentity.role_type != "GN") {
        connection.query("select algaeh_d_app_group_id,EDM.user_id as cashier_id,G.group_type,hims_d_employee_id,\
        employee_code,E.full_name as cashier_name          \
        from algaeh_d_app_group G         inner join algaeh_d_app_roles R\
        on G.algaeh_d_app_group_id=R.app_group_id     \
        inner join algaeh_m_role_user_mappings RU on R.app_d_app_roles_id=RU.role_id     \
        inner join hims_m_employee_department_mappings EDM on RU.user_id=EDM.user_id\
        inner join hims_d_employee  E on EDM.employee_id=E.hims_d_employee_id\
        where group_type in('C') order by cashier_id desc", function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      } else {
        req.records = {
          validUser: false,
          message: "you dont have admin privilege"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var addCashierToShift = function addCashierToShift(req, res, next) {
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

      connection.query("INSERT INTO `hims_m_cashier_shift` (cashier_id, shift_id, year,month,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?)", [input.cashier_id, input.shift_id, input.year, input.month, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to
var getCashiersAndShiftMAP = function getCashiersAndShiftMAP(req, res, next) {
  var selectWhere = {
    hims_m_cashier_shift_id: "ALL",
    cashier_id: "ALL",
    month: "ALL",
    year: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    if (req.query.for == "T") {
      (0, _extend2.default)(selectWhere, {
        cashier_id: req.body.created_by
      });
      delete req.query.for;
    } else {
      delete req.query.for;
    }

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
    db.getConnection(function (error, connection) {
      connection.query("select hims_m_cashier_shift_id, cashier_id, shift_id,shift_description, year, month,\
            hims_d_employee_department_id,EDM.employee_id,E.full_name as cashier_name\
            from hims_m_cashier_shift CS,hims_d_shift S,hims_d_employee E ,hims_m_employee_department_mappings EDM\
              where CS.record_status='A' and S.record_status='A' and CS.shift_id=S.hims_d_shift_id \
              and CS.cashier_id=EDM.user_id  and EDM.employee_id=E.hims_d_employee_id\
               and " + where.condition + "order by hims_m_cashier_shift_id desc", where.values, function (error, result) {
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

//created by irfan: to
var updateCashiersAndShiftMAP = function updateCashiersAndShiftMAP(req, res, next) {
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

      connection.query("UPDATE `hims_m_cashier_shift` SET  shift_id=?,\
           updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_m_cashier_shift_id`=?;", [input.shift_id, new Date(), input.updated_by, input.hims_m_cashier_shift_id], function (error, result) {
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

//created by irfan: to
var deleteCashiersAndShiftMAP = function deleteCashiersAndShiftMAP(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_m_cashier_shift",
      id: req.body.hims_m_cashier_shift_id,
      query: "UPDATE hims_m_cashier_shift SET  record_status='I' WHERE hims_m_cashier_shift_id=?",
      values: [req.body.hims_m_cashier_shift_id]
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
  addShiftMaster: addShiftMaster,
  addCounterMaster: addCounterMaster,
  getCounterMaster: getCounterMaster,
  getShiftMaster: getShiftMaster,
  updateShiftMaster: updateShiftMaster,
  updateCounterMaster: updateCounterMaster,
  getCashiers: getCashiers,
  addCashierToShift: addCashierToShift,
  getCashiersAndShiftMAP: getCashiersAndShiftMAP,
  updateCashiersAndShiftMAP: updateCashiersAndShiftMAP,
  deleteCashiersAndShiftMAP: deleteCashiersAndShiftMAP
};
//# sourceMappingURL=shiftAndCounter.js.map