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
    if (queryConfig == null) {
      next(
        httpStatus.generateError(
          httpStatus.unAuthorized,
          "No access for this content"
        )
      );
    }
    let db = req.db;
    if (db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let limit =
      req.query.pageSize == null || req.query.pageSize === 0
        ? 5
        : req.query.pageSize;
    //let offSet = req.query.pageNo === 0 ? limit * 1 : limit * req.query.pageNo;
    let offSet = req.query.pageNo;
    let whereCondition =
      req.query.fieldName == null
        ? " "
        : " and upper(" +
          req.query.fieldName +
          ") like  upper('%" +
          req.query.fieldContains +
          "%')";

    const _groupby =
      queryConfig.groupBy != null ? " " + queryConfig.groupBy + " " : "";

    whereCondition +=
      req.query.inputs == null ? "" : " and " + req.query.inputs;
    let query =
      queryConfig.searchQuery +
      whereCondition +
      _groupby +
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
