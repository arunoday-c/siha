"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import formater from "../../keys/keys";
// import { decryption } from "../../utils/cryptography";


//created by irfan: to add vital header
var addVitalMasterHeader = function addVitalMasterHeader(req, res, next) {
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

      connection.query("INSERT INTO `hims_d_vitals_header` (vitals_name, uom,general,display,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)", [input.vitals_name, input.uom, input.general, input.display, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to getVitalMasterHeader

//import { LINQ } from "node-linq";
// import moment from "moment";
var getVitalMasterHeader = function getVitalMasterHeader(req, res, next) {
  var selectWhere = {
    hims_d_vitals_header_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_vitals_header_id,uom, vitals_name,general,display FROM hims_d_vitals_header where record_status='A' AND" + where.condition + " order by hims_d_vitals_header_id desc", where.values, function (error, result) {
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

//created by irfan: to deleteVitalMasterHeader
var deleteVitalMasterHeader = function deleteVitalMasterHeader(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_vitals_header",
      id: req.body.hims_d_vitals_header_id,
      query: "UPDATE hims_d_vitals_header SET  record_status='I' WHERE hims_d_vitals_header_id=?",
      values: [req.body.hims_d_vitals_header_id]
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

//created by irfan: to updateVitalMasterHeader
var updateVitalMasterHeader = function updateVitalMasterHeader(req, res, next) {
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

      connection.query("UPDATE `hims_d_vitals_header` SET vitals_name=?,uom=?,general=?,display=?,\
             updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vitals_header_id`=?;", [input.vitals_name, input.uom, input.general, input.display, new Date(), input.updated_by, input.hims_d_vitals_header_id], function (error, result) {
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

//created by irfan: to add vital detail
var addVitalMasterDetail = function addVitalMasterDetail(req, res, next) {
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

      connection.query("INSERT INTO `hims_d_vitals_details` (vitals_header_id, gender, min_age, max_age, min_value, max_value, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?)", [input.vitals_header_id, input.gender, input.min_age, input.max_age, input.min_value, input.max_value, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to getVitalMasterHeader
var getVitalMasterDetail = function getVitalMasterDetail(req, res, next) {
  var selectWhere = {
    vitals_header_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_vitals_details_id, vitals_header_id, gender, min_age, max_age, min_value, max_value FROM hims_d_vitals_details where record_status='A' AND" + where.condition + " order by vitals_header_id desc", where.values, function (error, result) {
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

//created by irfan: to deleteVitalMasterDetail
var deleteVitalMasterDetail = function deleteVitalMasterDetail(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_vitals_details",
      id: req.body.hims_d_vitals_details_id,
      query: "UPDATE hims_d_vitals_details SET  record_status='I' WHERE hims_d_vitals_details_id=?",
      values: [req.body.hims_d_vitals_details_id]
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

//created by irfan: to updateVitalMasterDetail
var updateVitalMasterDetail = function updateVitalMasterDetail(req, res, next) {
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

      connection.query("UPDATE `hims_d_vitals_details` SET  vitals_header_id=?, gender=?, min_age=?, max_age=?, min_value=?, max_value=?,\
             updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vitals_details_id`=?;", [input.vitals_header_id, input.gender, input.min_age, input.max_age, input.min_value, input.max_value, new Date(), input.updated_by, input.hims_d_vitals_details_id], function (error, result) {
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

//created by irfan: to add 
var addDepartmentVitalMap = function addDepartmentVitalMap(req, res, next) {
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

      var insurtColumns = ["vital_header_id", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_m_department_vital_mapping(" + insurtColumns.join(",") + ",`department_id`,created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body.vitals,
        newFieldToInsert: [input.department_id, new Date(), new Date()],
        req: req
      })], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        (0, _logging.debugLog)("Results are recorded...");
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to 
var getDepartmentVitalMap = function getDepartmentVitalMap(req, res, next) {
  var selectWhere = {
    hims_m_department_vital_mapping_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_m_department_vital_mapping_id,department_id,vital_header_id FROM hims_m_department_vital_mapping where record_status='A' AND" + where.condition + " order by hims_m_department_vital_mapping_id desc", where.values, function (error, result) {
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
  addVitalMasterHeader: addVitalMasterHeader,
  addVitalMasterDetail: addVitalMasterDetail,
  getVitalMasterHeader: getVitalMasterHeader,
  getVitalMasterDetail: getVitalMasterDetail,
  deleteVitalMasterHeader: deleteVitalMasterHeader,
  deleteVitalMasterDetail: deleteVitalMasterDetail,
  updateVitalMasterHeader: updateVitalMasterHeader,
  updateVitalMasterDetail: updateVitalMasterDetail,
  addDepartmentVitalMap: addDepartmentVitalMap,
  getDepartmentVitalMap: getDepartmentVitalMap

};
//# sourceMappingURL=workBenchSetup.js.map