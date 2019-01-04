"use strict";

var _searchGlobal = require("../utils/searchGlobal");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _utils = require("../utils");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchData = function searchData(req, res, next) {
  (0, _logging.debugFunction)("searchData");
  try {
    var inputParam = req.query;
    (0, _logging.debugLog)("Query based Parameters", inputParam);
    if (inputParam.searchName == null || inputParam.searchName == "") next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please provide correct search details"));
    var queryConfig = (0, _searchGlobal.algaehSearchConfig)(inputParam.searchName);
    if (queryConfig == null) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.unAuthorized, "No access for this content"));
    }
    var db = req.db;
    if (db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var limit = req.query.pageSize == null || req.query.pageSize === 0 ? 5 : req.query.pageSize;
    //let offSet = req.query.pageNo === 0 ? limit * 1 : limit * req.query.pageNo;
    var offSet = req.query.pageNo;
    var whereCondition = req.query.fieldName == null ? " " : " and upper(" + req.query.fieldName + ") like  upper('%" + req.query.fieldContains + "%')";

    var _groupby = queryConfig.groupBy != null ? " " + queryConfig.groupBy + " " : "";

    whereCondition += req.query.inputs == null ? "" : " and " + req.query.inputs;
    var query = queryConfig.searchQuery + whereCondition + _groupby + " order by " + queryConfig.orderBy + " limit " + limit + " OFFSET " + offSet + " ;" + " SELECT FOUND_ROWS() total_pages;";
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
  searchData: searchData
};
//# sourceMappingURL=globalSearch.js.map