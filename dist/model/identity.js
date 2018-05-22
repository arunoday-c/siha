"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var identityDoc = {
  hims_d_identity_document_id: null,
  identity_document_code: null,
  identity_document_name: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null
};
var addIdentity = function addIdentity(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var db = req.db;
    var insertDoc = (0, _extend2.default)(identityDoc, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("INSERT INTO `hims_d_identity_document` \
            (`identity_document_code`, `identity_document_name`, `created_by`, `created_date`)\
            VALUE (?, ?, ?, ?)", [insertDoc.identity_document_code, insertDoc.identity_document_name, insertDoc.created_by, new Date()], function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        insertDoc.hims_d_identity_document_id = result.insertId;
        connection.query("SELECT `hims_d_identity_document_id`, `identity_document_code`,\
         `identity_document_name` \
         FROM `hims_d_identity_document` WHERE `record_status`='A' AND \
         `hims_d_identity_document_id`=? ", [insertDoc.hims_d_identity_document_id], function (error, resultData) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = resultData;
          next();
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
var updateIdentity = function updateIdentity(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var updateIdentityDoc = (0, _extend2.default)(identityDoc, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }
      connection.query("UPDATE `hims_d_identity_document`\
    SET  `identity_document_name`=?, `updated_by`=?, `updated_date`=?\
    WHERE `record_status`='A' AND `hims_d_identity_document_id`=?;", [updateIdentityDoc.identity_document_name, updateIdentityDoc.updated_by, new Date(), updateIdentityDoc.hims_d_identity_document_id], function (error, result) {
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

var selectWhereCondition = {
  hims_d_identity_document_id: "ALL",
  identity_document_code: "ALL",
  identity_document_name: "ALL"
};
var selectIdentity = function selectIdentity(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var condition = (0, _utils.whereCondition)((0, _extend2.default)(selectWhereCondition, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT `hims_d_identity_document_id`, `identity_document_code`, `identity_document_name`\
          ,`created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_identity_document` WHERE record_status ='A' AND " + condition.condition,
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

module.exports = {
  addIdentity: addIdentity,
  updateIdentity: updateIdentity,
  selectIdentity: selectIdentity
};
//# sourceMappingURL=identity.js.map