"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var whereStatement = {
  hims_d_visit_type_id: "ALL",
  visit_type_code: "ALL",
  visit_type_desc: "ALL"
};

var selectStatement = function selectStatement(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var where = (0, _utils.whereCondition)((0, _extend2.default)(whereStatement, req.query));
      connection.query("SELECT `hims_d_visit_type_id`, `visit_type_code`, `visit_type_desc`,`visit_status`\
       , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_visit_type`  WHERE record_status='A' AND " + where.condition, where.values, function (error, result) {
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
var visitType = {
  hims_d_visit_type_id: null,
  visit_type_code: null,
  visit_type_desc: null,
  hims_d_visit_type: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  record_status: null,
  visit_status: "A"
};

var addVisit = function addVisit(req, res, next) {
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(visitType, req.body);
    connection.query("INSERT INTO `hims_d_visit_type` (`visit_type_code`, `visit_type_desc`, `hims_d_visit_type`, `created_by` \
     , `created_date`,`visit_status`) \
   VALUES ( ?, ?, ?, ?, ?,?)", [inputParam.visit_type_code, inputParam.visit_type_desc, inputParam.hims_d_visit_type, inputParam.created_by, new Date(), inputParam.visit_status], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateVisit = function updateVisit(req, res, next) {
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(visitType, req.body);
    connection.query("UPDATE `hims_d_visit_type` \
     SET `visit_type_desc`=?, `hims_d_visit_type`=?,  `updated_by`=?, `updated_date`=?,visit_status=? \
     WHERE `record_status`='A' and `hims_d_visit_type_id`=?", [inputParam.visit_type_desc, inputParam.hims_d_visit_type, inputParam.updated_by, new Date(), inputParam.visit_status, inputParam.hims_d_visit_type_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteVisitType = function deleteVisitType(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_visit_type",
      id: req.body.hims_d_visit_type_id,
      query: "UPDATE hims_d_visit_type SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_visit_type_id=?",
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
  selectStatement: selectStatement,
  addVisit: addVisit,
  updateVisit: updateVisit,
  deleteVisitType: deleteVisitType
};
//# sourceMappingURL=visitType.js.map