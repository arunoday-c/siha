"use strict";

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

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
      db.query("SELECT `his_d_title_id`, `title` FROM `hims_d_title` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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
        nexxt(error);
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
      db.query("SELECT `hims_d_nationality_id`, `nationality_code`, `nationality` FROM `hims_d_nationality` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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
      connection.query("SELECT `hims_d_religion_id`, `religion_code`, `religion_name` FROM `hims_d_religion` WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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
  visa_desc: "ALL",
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
      connection.query("SELECT `hims_d_visa_type_id`, `visa_type_code`, `visa_type`, `visa_desc`, `created_by`, \
        `created_date`, `updated_by`, `updated_date`, `record_status` FROM `hims_d_visa_type` \
         WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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
  titleMaster: titleMaster,
  countryMaster: countryMaster,
  stateMaster: stateMaster,
  cityMaster: cityMaster,
  relegionMaster: relegionMaster,
  nationalityMaster: nationalityMaster,
  autoGenMaster: autoGenMaster,
  visaMaster: visaMaster
};
//# sourceMappingURL=masters.js.map