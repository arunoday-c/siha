import searchUtils from "../utils/searchGlobal";
import httpStatus from "../utils/httpStatus";
import mysql from "mysql";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
import _ from "lodash";

const { algaehSearchConfig } = searchUtils;

let searchData = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputParam = req.query;
    if (inputParam.searchName == null || inputParam.searchName == "")
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please provide correct search details"
        )
      );
    let queryConfig = algaehSearchConfig(inputParam.searchName, req);
    if (queryConfig == null) {
      next(
        httpStatus.generateError(
          httpStatus.unAuthorized,
          "No access for this content"
        )
      );
    }

    let limit =
      req.query.pageSize == null || req.query.pageSize === 0
        ? 5
        : req.query.pageSize;
    //let offSet = req.query.pageNo === 0 ? limit * 1 : limit * req.query.pageNo;
    let offSet = req.query.pageNo;

    // let whereCondition =
    //   req.query.fieldName == null
    //     ? " "
    //     : " and upper(" +
    //       req.query.fieldName +
    //       ") like  upper('%" +
    //       req.query.fieldContains +
    //       "%')";

    let whereCondition = " ";

    if (
      req.query.fieldName != null &&
      req.query.fieldContains != null &&
      req.query.fieldContains.length > 1
    ) {
      const filterBy = req.query.filterBy;
      switch (filterBy) {
        case "STW":
          whereCondition =
            " and " +
            req.query.fieldName +
            " like  '" +
            req.query.fieldContains +
            "%' ";
          break;

        case "ENW":
          whereCondition =
            " and " +
            req.query.fieldName +
            " like  '%" +
            req.query.fieldContains +
            "' ";
          break;
        case "EQU":
          whereCondition =
            " and " +
            req.query.fieldName +
            " =  '" +
            req.query.fieldContains +
            "' ";
          break;

        default:
          whereCondition =
            " and " +
            req.query.fieldName +
            " like  '%" +
            req.query.fieldContains +
            "%' ";
          break;
      }
    }

    const _groupby =
      queryConfig.groupBy != null ? " " + queryConfig.groupBy + " " : "";

    const _orderby =
      queryConfig.orderBy != null
        ? "  order by " + queryConfig.orderBy + " "
        : "";

    whereCondition +=
      req.query.inputs == "null" || null ? "" : " and " + req.query.inputs;
    let query =
      queryConfig.searchQuery +
      whereCondition +
      _groupby +
      _orderby +
      " limit " +
      limit +
      " OFFSET " +
      offSet +
      " ;" +
      " SELECT FOUND_ROWS() total_pages;";

    _mysql
      .executeQuery({
        query: query,
        printQuery: true
      })
      .then(result => {
        // console.log("result",result);
        _mysql.releaseConnection();
        // req.records = result;
        let rec={};
        if (result !== undefined) {
          // result = new Object();
          rec["totalPages"] =result[1][0].total_pages;
          rec["data"] = result[0];
        }

        res.status(httpStatus.ok).json({
          success: true,
          records: rec
        }).end();
        // next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

const newSearch = (req, res, next) => {
  let inputParam = req.body;

  if (inputParam.searchName == null || inputParam.searchName == "") {
    next(
      httpStatus.generateError(
        httpStatus.badRequest,
        "Please provide correct search details"
      )
    );
    return;
  }
  let queryConfig = algaehSearchConfig(inputParam.searchName, req);
  if (queryConfig == null) {
    next(
      httpStatus.generateError(
        httpStatus.unAuthorized,
        "No access for this content"
      )
    );
    return;
  }

  let limit =
    inputParam.pageSize == null || inputParam.pageSize === 0
      ? 10
      : inputParam.pageSize;
  let offSet = inputParam.pageNo;
  let _hasQuery = queryConfig.searchQuery;
  if (
    !String(_hasQuery)
      .toUpperCase()
      .includes("WHERE")
  ) {
    _hasQuery += " WHERE ";
  }

  let _values = [];
  let sortedParameters = [];
  const queryP = queryConfig.inputSequence;

  if (queryP != null) {
    for (let p = 0; p < queryP.length; p++) {
      for (let f = 0; f < inputParam.parameters.length; f++) {
        const keyCollection = Object.keys(inputParam.parameters[f]);
        const keyName = _.find(keyCollection, f => f == queryP[p]);
        if (keyName != null) {
          _values.push(inputParam.parameters[f][keyName]);
          break;
        }
      }
    }

    for (let k = 0; k < inputParam.parameters.length; k++) {
      const items = inputParam.parameters[k];
      _.keysIn(items).map(key => {
        const isKeyMatch = _.find(queryP, f => f === key);
        if (isKeyMatch == null) {
          sortedParameters.push(items);
        }
      });
    }
  } else {
    sortedParameters = inputParam.parameters;
  }

  if (
    String(_hasQuery)
      .toLowerCase()
      .includes("{mapper}")
  ) {
    let mapper =
      "(" +
      _.map(sortedParameters, items => {
        return _.keysIn(items).map(key => {
          // _values.push("%" + items[key] + "%");
          return String(" " + key + " ") + " LIKE  '%" + items[key] + "%' ";
        });
      }).join(" OR ") +
      ")";

    _hasQuery = _hasQuery.replace(/{mapper}/g, mapper);
  } else {
    _hasQuery +=
      " AND (" +
      _.map(sortedParameters, items => {
        return _.keysIn(items).map(key => {
          if (key != null) {
            _values.push("%" + items[key] + "%");
            return String(" " + key + " ");
          }
        });
      }).join(" LIKE  ?  OR ") +
      " LIKE  ? )";
  }
  if (inputParam.directCondition != null) {
    _hasQuery += inputParam.directCondition;
  }
  if (queryConfig.groupBy != null) {
    _hasQuery += " " + queryConfig.groupBy;
  }
  if (queryConfig.orderBy != null) {
    _hasQuery += " ORDER BY " + queryConfig.orderBy;
  }
  _hasQuery += " LIMIT ? OFFSET ? ;SELECT FOUND_ROWS() total_pages;";
  _values.push(limit);
  _values.push(offSet);

  const _query = mysql.format(_hasQuery, _values);
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: _query,
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
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
};

export default {
  searchData,
  newSearch
};
