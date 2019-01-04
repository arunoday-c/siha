"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectPattypeStatement = function selectPattypeStatement(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = (0, _utils.paging)(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    // let condition = whereCondition(extend({}, req.query));
    var query = "SELECT SQL_CALC_FOUND_ROWS `hims_d_patient_type_id`, `patient_type_code`, `patitent_type_desc`,`arabic_patitent_type_desc`\
    , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_patient_type`  WHERE record_status='A';" + pagePaging + " " + "SELECT FOUND_ROWS() total_pages";

    (0, _logging.debugLog)("Love", query);
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT SQL_CALC_FOUND_ROWS `hims_d_patient_type_id`, `patient_type_code`, `patitent_type_desc`,`arabic_patitent_type_desc`\
        , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_patient_type`  WHERE record_status='A';" + pagePaging + " " + "SELECT FOUND_ROWS() total_pages"
    }, function (result) {
      req.records = result;

      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     let where = whereCondition(extend(whereStatement, req.query));
  //     connection.query(
  //       "SELECT `hims_d_patient_type_id`, `patient_type_code`, `patitent_type_desc`,`arabic_patitent_type_desc`\
  //      , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_patient_type`  WHERE record_status='A' AND " +
  //         where.condition,
  //       where.values,
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //         req.records = result;
  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

var addPatientType = function addPatientType(req, res, next) {
  var visitType = {
    hims_d_patient_type_id: null,
    patient_type_code: null,
    patitent_type_desc: null,
    arabic_patitent_type_desc: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    visit_status: "A"
  };

  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(visitType, req.body);
    connection.query("INSERT INTO `hims_d_patient_type` (`patient_type_code`, `patitent_type_desc`, `arabic_patitent_type_desc`, `created_by` \
     , `created_date`) \
   VALUES ( ?, ?, ?, ?, ?)", [inputParam.patient_type_code, inputParam.patitent_type_desc, inputParam.arabic_patitent_type_desc, inputParam.created_by, new Date()], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updatePatientType = function updatePatientType(req, res, next) {
  var visitType = {
    hims_d_patient_type_id: null,
    patient_type_code: null,
    patitent_type_desc: null,
    arabic_patitent_type_desc: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    visit_status: "A"
  };

  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(visitType, req.body);
    connection.query("UPDATE `hims_d_patient_type` \
     SET `patitent_type_desc`=?, `arabic_patitent_type_desc`=?,  `updated_by`=?, `updated_date`=?\
     WHERE `record_status`='A' and `hims_d_patient_type_id`=?", [inputParam.patitent_type_desc, inputParam.arabic_patitent_type_desc, inputParam.updated_by, new Date(), inputParam.hims_d_patient_type_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deletePatientType = function deletePatientType(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _logging.debugLog)("req.body.hims_d_patient_type_id", req.body.hims_d_patient_type_id);
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_patient_type",
      id: req.body.hims_d_patient_type_id,
      query: "UPDATE hims_d_patient_type SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_patient_type_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_patient_type_id]
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

var getPatientType = function getPatientType(req, res, next) {
  var whereStatement = {
    hims_d_patient_type_id: "ALL",
    patient_type_code: "ALL",
    patitent_type_desc: "ALL"
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
      connection.query("SELECT * FROM `hims_d_patient_type`  \
       WHERE record_status='A' AND " + where.condition + " order by hims_d_patient_type_id desc", where.values, function (error, result) {
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
  selectPattypeStatement: selectPattypeStatement,
  addPatientType: addPatientType,
  updatePatientType: updatePatientType,
  deletePatientType: deletePatientType,
  getPatientType: getPatientType
};
//# sourceMappingURL=patientType.js.map