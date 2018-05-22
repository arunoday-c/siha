"use strict";

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelAppGen = {
  hims_f_app_numgen_id: null,
  numgen_code: null,
  module_desc: null,
  prefix: null,
  intermediate_series: null,
  postfix: null,
  length: null,
  increment_by: null,
  numgen_seperator: null,
  postfix_start: null,
  postfix_end: null,
  current_num: null,
  pervious_num: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  record_status: null
};
var insertToAppgen = function insertToAppgen(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var inputParam = (0, _extend2.default)(modelAppGen, req.body);
      connection.query("INSERT INTO `hims_f_app_numgen` (`numgen_code`, `module_desc`\
      , `prefix`, `intermediate_series`, `postfix`, `length`, `increment_by`\
      , `numgen_seperator`, `postfix_start`, `postfix_end`, `current_num`\
      , `pervious_num`, `created_by`, `created_date`)\
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [inputParam.numgen_code, inputParam.module_desc, inputParam.prefix, inputParam.intermediate_series, inputParam.postfix, inputParam.length, inputParam.increment_by, inputParam.numgen_seperator, inputParam.postfix_start, inputParam.postfix_end, inputParam.current_num, inputParam.pervious_num, inputParam.created_by, new Date()], function (error, result) {
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
var updateToAppgen = function updateToAppgen(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var inputParam = (0, _extend2.default)(modelAppGen, req.body);
      connection.query("UPDATE `hims_f_app_numgen` \
          SET  `numgen_code`=?, `module_desc`=?, `prefix`=?, \
          `intermediate_series`=?, `postfix`=?, `length`=?, `increment_by`=?,\
          `numgen_seperator`=?, `postfix_start`=?, `postfix_end`=?, \
          `current_num`=?, `pervious_num`=?,  `updated_by`=?, `updated_date`=? \
          WHERE  `record_status`='A' AND `hims_f_app_numgen_id`=?", [inputParam.numgen_code, inputParam.module_desc, inputParam.prefix, inputParam.intermediate_series, inputParam.postfix, inputParam.length, inputParam.increment_by, inputParam.numgen_seperator, inputParam.postfix_start, inputParam.postfix_end, inputParam.current_num, inputParam.pervious_num, inputParam.updated_by, new Date(), inputParam.hims_f_app_numgen_id], function (error, result) {
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

var visaType = {
  hims_d_visa_type_id: null,
  visa_type_code: null,
  visa_type: null,
  visa_desc: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  record_status: null
};
var addVisa = function addVisa(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var inputParam = (0, _extend2.default)(visaType, req.body);
      connection.query("INSERT INTO `hims_d_visa_type` ( `visa_type_code`, `visa_type`, `visa_desc`, `created_by`, `created_date`) \
     VALUES (?, ?, ?, ?, ?)", [inputParam.visa_type_code, inputParam.visa_type, inputParam.visa_desc, inputParam.created_by, new Date()], function (error, result) {
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

var updateVisa = function updateVisa(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var inputParam = (0, _extend2.default)(visaType, req.body);
      connection.query("UPDATE `hims_d_visa_type` \
        SET `visa_type`=?, `visa_desc`=?, `updated_by`=?, `updated_date`=? \
        WHERE `record_status`='A' and `hims_d_visa_type_id`=?", [inputParam.visa_type, inputParam.visa_desc, inputParam.updated_by, new Date(), inputParam.hims_d_visa_type_id], function (error, result) {
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

var deleteVisa = function deleteVisa(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_visa_type",
      id: req.body.hims_d_visa_type_id,
      query: "UPDATE hims_d_visa_type SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_visa_type_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_visit_type_id]
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

module.exports = {
  insertToAppgen: insertToAppgen,
  updateToAppgen: updateToAppgen,
  updateVisa: updateVisa,
  addVisa: addVisa,
  deleteVisa: deleteVisa
};
//# sourceMappingURL=mastersUpdate.js.map