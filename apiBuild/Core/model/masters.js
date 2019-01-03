"use strict";

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var titleWhere = {
  his_d_title_id: "ALL",
  title: "ALL"
};

var titleMaster = function titleMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(titleWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT `his_d_title_id`, `title`, `arabic_title` FROM `hims_d_title` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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

var countryWhere = {
  hims_d_country_id: "ALL",
  country_code: "ALL",
  country_name: "ALL",
  status: "ALL"
};
var countryMaster = function countryMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(countryWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT `hims_d_country_id`, `country_code`, `country_name`, `status` FROM `hims_d_country` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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

var stateWhere = {
  hims_d_state_id: "ALL",
  state_code: "ALL",
  state_name: "ALL",
  country_id: "ALL"
};
var stateMaster = function stateMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(stateWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT `hims_d_state_id`, `state_code`, `state_name`, `country_id` FROM `hims_d_state` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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
var cityWhere = {
  hims_d_city_id: "ALL",
  city_code: "ALL",
  city_name: "ALL",
  state_id: "ALL"
};
var cityMaster = function cityMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(cityWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT `hims_d_city_id`, `city_code`, `city_name`, `state_id` FROM `hims_d_city` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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

var nationalityWhere = {
  hims_d_nationality_id: "ALL",
  nationality_code: "ALL",
  nationality: "ALL"
};
var nationalityMaster = function nationalityMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(nationalityWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT `hims_d_nationality_id`, `nationality_code`, `nationality`,`arabic_nationality` FROM `hims_d_nationality` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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

var religionWhere = {
  hims_d_religion_id: "ALL",
  religion_code: "ALL",
  religion_name: "ALL"
};
var relegionMaster = function relegionMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(religionWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT `hims_d_religion_id`, `religion_code`, `religion_name`,`arabic_religion_name` FROM `hims_d_religion` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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

var auogenWhere = {
  hims_f_app_numgen_id: "ALL",
  numgen_code: "ALL",
  module_desc: "ALL"
};
var autoGenMaster = function autoGenMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(auogenWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT `hims_f_app_numgen_id`, `numgen_code`, `module_desc`, `prefix`, `intermediate_series`, `postfix`, `length`, `increment_by`, `numgen_seperator`, `postfix_start`, `postfix_end`, `current_num`, `pervious_num` FROM `hims_f_app_numgen` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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

var visaWhere = {
  hims_d_visa_type_id: "ALL",
  visa_type_code: "ALL",
  visa_type: "ALL"
};
var visaMaster = function visaMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(visaWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT `hims_d_visa_type_id`, `visa_type_code`, `visa_type`, `arabic_visa_type`, \
         `created_by`, `created_date`, `updated_by`, `updated_date`, `visa_status` FROM \
         `hims_d_visa_type` WHERE `record_status`='A' AND " + where.condition + " order by hims_d_visa_type_id desc", where.values, function (error, result) {
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

var inputClicnicalNonClinicalDept = {
  department_type: "ALL"
};

var clinicalNonClinicalAll = function clinicalNonClinicalAll(req, res, next) {
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

      connection.query("select hims_d_sub_department.hims_d_sub_department_id ,sub_department_code,sub_department_name\
       ,sub_department_desc, arabic_sub_department_name, hims_d_sub_department.department_id,hims_d_department.department_type \
       from hims_d_sub_department,hims_d_department where \
       hims_d_sub_department.department_id=hims_d_department.hims_d_department_id \
       and hims_d_department.record_status='A' and sub_department_status='A' \
       " + connectionString, function (error, result) {
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

var countryStateCity = function countryStateCity(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("select  hims_d_country_id,country_name,arabic_country_name  from hims_d_country where status='A';\
        select hims_d_state_id,state_name,arabic_state_name,country_id  from hims_d_state where record_status='A';\
        select  hims_d_city_id,city_name,city_arabic_name,state_id  from hims_d_city where record_status='A';", function (error, result) {
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

//created by irfan: to  kill all the database-connections
var killDbConnections = function killDbConnections(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      (0, _logging.debugLog)("killDbConnections:");
      connection.query("show full processlist", function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        (0, _logging.debugLog)("result:", result);
        var idList = new _nodeLinq.LINQ(result).Where(function (w) {
          return w.User == "algaeh_root";
        }).Select(function (s) {
          return s.Id;
        }).ToArray();

        (0, _logging.debugLog)("idList:", idList);
        var qry = "";
        for (var i = 0; i < idList.length; i++) {
          qry += "kill " + idList[i] + ";";
        }
        if (idList.length > 0) {
          connection.query(qry, function (error, finalResult) {
            (0, _utils.releaseDBConnection)(db, connection);
            if (error) {
              next(error);
            }

            req.records = "all process deleted";
            next();
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = result;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
var getBank = function getBank(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("select   hims_d_bank_id, bank_name, bank_code, bank_short_name,\
         address1, contact_person, contact_number, active_status from\
          hims_d_bank where record_status='A' order by hims_d_bank_id desc ", function (error, result) {
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
module.exports = {
  titleMaster: titleMaster,
  countryMaster: countryMaster,
  stateMaster: stateMaster,
  cityMaster: cityMaster,
  relegionMaster: relegionMaster,
  nationalityMaster: nationalityMaster,
  autoGenMaster: autoGenMaster,
  visaMaster: visaMaster,
  clinicalNonClinicalAll: clinicalNonClinicalAll,
  countryStateCity: countryStateCity,
  killDbConnections: killDbConnections,
  getBank: getBank
};
//# sourceMappingURL=masters.js.map