import { algaehReportConfig } from "../utils/reportMaker";
import httpStatus from "../utils/httpStatus";
import { releaseDBConnection } from "../utils";
import { debugFunction, debugLog } from "../utils/logging";
import mysql from "mysql";
let getReport = (req, res, next) => {
  try {
    let inputParam = req.query;

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

    const _orderBy =
      queryConfig.orderBy != null ? " " + queryConfig.orderBy + " " : "";
    let query = queryConfig.reportQuery + _groupby + _orderBy + " ;";

    const _queryHasQuestion = queryConfig.questionOrder != null ? true : false;
    let inputData = [];
    if (_queryHasQuestion == true) {
      queryConfig.questionOrder.map(item => {
        if (inputParam[item] != null) inputData.push(inputParam[item]);
      });
    }

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      const _myQuery = mysql.format(query, inputData);

      connection.query(_myQuery, (error, result) => {
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
