import { algaehSearchConfig } from "../utils/searchGlobal";
import httpStatus from "../utils/httpStatus";
import { releaseDBConnection } from "../utils";
import { debugFunction, debugLog } from "../utils/logging";
let searchData = (req, res, next) => {
  debugFunction("searchData");
  try {
    let inputParam = req.query;
    debugLog("Query based Parameters", inputParam);
    if (inputParam.searchName == null || inputParam.searchName == "")
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please provide correct search details"
        )
      );
    let queryConfig = algaehSearchConfig(inputParam.searchName);
    if (queryConfig === undefined) {
      next(
        httpStatus.generateError(
          httpStatus.unAuthorized,
          "No access for this content"
        )
      );
    }
    let db = req.db;
    if (db === undefined) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let limit =
      req.query.pageSize === undefined || req.query.pageSize === 0
        ? 5
        : req.query.pageSize;
    //let offSet = req.query.pageNo === 0 ? limit * 1 : limit * req.query.pageNo;
    let offSet = req.query.pageNo === 0 ? 1 : req.query.pageNo;
    let whereCondition =
      req.query.fieldName === undefined
        ? " "
        : " and " +
          req.query.fieldName +
          " like '%" +
          req.query.fieldContains +
          "%'";
    let query =
      queryConfig.searchQuery +
      whereCondition +
      " order by " +
      queryConfig.orderBy +
      " limit " +
      limit +
      " OFFSET " +
      offSet +
      " ;" +
      " SELECT FOUND_ROWS() total_pages;";
    debugLog("SQL Query : ", query);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(query, (error, result) => {
        releaseDBConnection(db, connection);
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
  searchData
};
