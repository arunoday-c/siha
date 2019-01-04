"use strict";

var _reportMaker = require("../utils/reportMaker");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _utils = require("../utils");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getReport = function getReport(req, res, next) {
  (0, _logging.debugFunction)("getReport");
  try {
    var inputParam = req.query;
    (0, _logging.debugLog)("Query based Parameters", inputParam);
    if (inputParam.reportName == null || inputParam.reportName == "") next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please provide correct report parameters"));

    var queryConfig = (0, _reportMaker.algaehReportConfig)(inputParam.reportName);
    if (queryConfig == null) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.unAuthorized, "No access for this content"));
    }
    var db = req.db;
    if (db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    // let limit =
    //   req.query.pageSize == null || req.query.pageSize === 0
    //     ? 5
    //     : req.query.pageSize;

    // let offSet = req.query.pageNo;

    // let whereCondition =
    //   req.query.fieldName == null        ? " "        : " and upper(" +          req.query.fieldName +         ") like  upper('%" +
    //       req.query.fieldContains +
    //       "%')";

    var _groupby = queryConfig.groupBy != null ? " " + queryConfig.groupBy + " " : "";

    var whereCondition = req.query.inputs == null ? "" : " and " + req.query.inputs;

    var query = queryConfig.reportQuery + whereCondition + _groupby + " order by " + queryConfig.orderBy + " ;";
    (0, _logging.debugLog)("SQL Query : ", query);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query(query, function (error, result) {
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
  getReport: getReport
};
//# sourceMappingURL=generateReport.js.map