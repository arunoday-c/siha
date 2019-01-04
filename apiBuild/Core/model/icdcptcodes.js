"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectIcdcptCodes = function selectIcdcptCodes(req, res, next) {
  var whereStatement = {
    hims_d_icd_id: "ALL",
    icd_code: "ALL",
    icd_description: "ALL"
  };
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
      connection.query("SELECT * FROM `hims_d_icd`  \
       WHERE record_status='A' AND " + where.condition, where.values, function (error, result) {
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

var insertIcdcptCodes = function insertIcdcptCodes(req, res, next) {
  var Icdcpts = {
    hims_d_icd_id: null,
    icd_code: null,
    icd_description: null,
    long_icd_description: null,
    icd_level: null,
    icd_type: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(Icdcpts, req.body);
    connection.query("INSERT INTO `hims_d_icd` (`icd_code`, `icd_description`,`long_icd_description`, `icd_level`, `icd_type` \
      , `created_by` ,`created_date`) \
   VALUES ( ?, ?, ?, ?, ?, ?, ?)", [inputParam.icd_code, inputParam.icd_description, inputParam.long_icd_description, inputParam.icd_level, inputParam.icd_type, inputParam.created_by, new Date()], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateIcdcptCodes = function updateIcdcptCodes(req, res, next) {
  var Icdcpts = {
    hims_d_icd_id: null,
    icd_code: null,
    icd_description: null,
    long_icd_description: null,
    icd_level: null,
    icd_type: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(Icdcpts, req.body);
    connection.query("UPDATE `hims_d_icd` \
     SET `icd_code`=?,  `icd_description`=?,`long_icd_description`=?, `icd_level`=?,`icd_type`=?, \
     `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `hims_d_icd_id`=?", [inputParam.icd_code, inputParam.icd_description, inputParam.long_icd_description, inputParam.icd_level, inputParam.icd_type, inputParam.updated_by, new Date(), inputParam.hims_d_icd_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteIcdcptCodes = function deleteIcdcptCodes(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_icd",
      id: req.body.hims_d_icd_id,
      query: "UPDATE hims_d_icd SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_icd_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_icd_id]
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

//Cpt Code

var selectCptCodes = function selectCptCodes(req, res, next) {
  var whereStatement = {
    hims_d_cpt_code_id: "ALL",
    cpt_code: "ALL",
    cpt_desc: "ALL"
  };
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
      connection.query("SELECT * FROM `hims_d_cpt_code`  \
       WHERE record_status='A' AND " + where.condition, where.values, function (error, result) {
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

var insertCptCodes = function insertCptCodes(req, res, next) {
  var Icdcpts = {
    hims_d_cpt_code_id: null,
    cpt_code: null,
    cpt_desc: null,
    long_cpt_desc: null,
    prefLabel: null,
    cpt_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(Icdcpts, req.body);
    connection.query("INSERT INTO `hims_d_cpt_code` (`cpt_code`, `cpt_desc`,`long_cpt_desc`, `prefLabel`, `cpt_status` \
      , `created_by` ,`created_date`) \
   VALUES ( ?, ?, ?, ?, ?, ?, ?)", [inputParam.cpt_code, inputParam.cpt_desc, inputParam.long_cpt_desc, inputParam.prefLabel, inputParam.cpt_status, inputParam.created_by, new Date()], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateCptCodes = function updateCptCodes(req, res, next) {
  var Icdcpts = {
    hims_d_cpt_code_id: null,
    cpt_code: null,
    cpt_desc: null,
    long_cpt_desc: null,
    prefLabel: null,
    cpt_status: "A",
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(Icdcpts, req.body);
    connection.query("UPDATE `hims_d_cpt_code` \
     SET `cpt_code`=?,  `cpt_desc`=?,`long_cpt_desc`=?, `prefLabel`=?,`cpt_status`=?, \
     `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `hims_d_cpt_code_id`=?", [inputParam.cpt_code, inputParam.cpt_desc, inputParam.long_cpt_desc, inputParam.prefLabel, inputParam.cpt_status, inputParam.updated_by, new Date(), inputParam.hims_d_cpt_code_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteCptCodes = function deleteCptCodes(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_cpt_code",
      id: req.body.hims_d_cpt_code_id,
      query: "UPDATE hims_d_cpt_code SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_cpt_code_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_cpt_code_id]
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
  selectIcdcptCodes: selectIcdcptCodes,
  insertIcdcptCodes: insertIcdcptCodes,
  updateIcdcptCodes: updateIcdcptCodes,
  deleteIcdcptCodes: deleteIcdcptCodes,

  selectCptCodes: selectCptCodes,
  insertCptCodes: insertCptCodes,
  updateCptCodes: updateCptCodes,
  deleteCptCodes: deleteCptCodes
};
//# sourceMappingURL=icdcptcodes.js.map