import reportMaker from "../utils/reportMaker";
import httpStatus from "../utils/httpStatus";
import mysql from "mysql";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const { algaehReportConfig } = reportMaker;

let getReport = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
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
    let inputs = req.query.inputs == null ? "" : req.query.inputs;

    const _groupby =
      queryConfig.groupBy != null ? " " + queryConfig.groupBy + " " : "";

    const _orderBy =
      queryConfig.orderBy != null ? " " + queryConfig.orderBy + " " : "";

    let query = queryConfig.reportQuery + inputs + _groupby + _orderBy + " ;";

    const _queryHasQuestion = queryConfig.questionOrder != null ? true : false;

    let inputData = [];
    if (_queryHasQuestion == true) {
      queryConfig.questionOrder.map(item => {
        if (inputParam[item] != null) inputData.push(inputParam[item]);
      });
    }

    const _myQuery = mysql.format(query, inputData);

    _mysql
      .executeQuery({
        query: _myQuery,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  getReport
};
