import { algaehReportConfig } from "../utils/reportMaker";
import httpStatus from "../utils/httpStatus";
import { releaseDBConnection } from "../utils";
import { debugFunction, debugLog } from "../utils/logging";

let getReport = (req, res, next) => {
  debugFunction("getReport");
  try {
    let inputParam = req.query;
    debugLog("Query based Parameters", inputParam);
    if (inputParam.reportName == null || inputParam.reportName == "")
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please provide correct report parameters"
        )
      );

    let queryConfig = algaehReportConfig(inputParam.reportName);
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
    // let limit =
    //   req.query.pageSize == null || req.query.pageSize === 0
    //     ? 5
    //     : req.query.pageSize;

    // let offSet = req.query.pageNo;

    // let whereCondition =
    //   req.query.fieldName == null        ? " "        : " and upper(" +          req.query.fieldName +         ") like  upper('%" +
    //       req.query.fieldContains +
    //       "%')";

    const _groupby =
      queryConfig.groupBy != null ? " " + queryConfig.groupBy + " " : "";

    let whereCondition =
      req.query.inputs == null ? "" : " and " + req.query.inputs;

    let query =
      queryConfig.reportQuery +
      whereCondition +
      _groupby +
      " order by " +
      queryConfig.orderBy +
      " ;";
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
  getReport
};
