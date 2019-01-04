"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to addCurrencyMaster

//import moment from "moment";
var addCurrencyMaster = function addCurrencyMaster(req, res, next) {
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

      connection.query("INSERT INTO `hims_d_currency` (currency_code, currency_description, currency_symbol, decimal_places, symbol_position,\
          thousand_separator, decimal_separator, negative_separator,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?)", [input.currency_code, input.currency_description, input.currency_symbol, input.decimal_places, input.symbol_position, input.thousand_separator, input.decimal_separator, input.negative_separator, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to getCurrencyMaster

//import { LINQ } from "node-linq";
var getCurrencyMaster = function getCurrencyMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("select hims_d_currency_id, currency_code, currency_description, currency_symbol,\
        decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator\
        FROM hims_d_currency where record_status='A' order by hims_d_currency_id desc ", function (error, result) {
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

//created by irfan: to deleteCurrencyMaster
var deleteCurrencyMaster = function deleteCurrencyMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_currency",
      id: req.body.hims_d_currency_id,
      query: "UPDATE hims_d_currency SET  record_status='I' WHERE hims_d_currency_id=?",
      values: [req.body.hims_d_currency_id]
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

//created by irfan: to  updateCurrencyMaster
var updateCurrencyMaster = function updateCurrencyMaster(req, res, next) {
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
      connection.query("UPDATE `hims_d_currency` SET  decimal_places=?, symbol_position=?, thousand_separator=?, decimal_separator=?, negative_separator=?,\
           updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_d_currency_id`=?;", [input.decimal_places, input.symbol_position, input.thousand_separator, input.decimal_separator, input.negative_separator, new Date(), input.updated_by, input.hims_d_currency_id], function (error, result) {
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
  addCurrencyMaster: addCurrencyMaster,
  getCurrencyMaster: getCurrencyMaster,
  deleteCurrencyMaster: deleteCurrencyMaster,
  updateCurrencyMaster: updateCurrencyMaster
};
//# sourceMappingURL=currency.js.map