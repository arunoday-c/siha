"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _opCreditSettlement = require("../model/opCreditSettlement");

var _logging = require("../utils/logging");

var _receiptentry = require("../model/receiptentry");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by Nowshad : to save opBilling
  api.post("/addCreidtSettlement", _utils.generateDbConnection, _receiptentry.ReceiptPaymentInsert, _opCreditSettlement.addCreidtSettlement, _opCreditSettlement.updateOPBilling, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      if (error) {
        connection.rollback(function () {
          releaseDBConnection(db, connection);
          next(error);
        });
      } else {
        var result = req.records;
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
        next();
      }
    });
  }, _utils.releaseConnection);

  api.get("/getCreidtSettlement", _utils.generateDbConnection, _opCreditSettlement.getCreidtSettlement, _receiptentry.getReceiptEntry, function (req, res, next) {
    (0, _logging.debugLog)("test: ", "test");
    var connection = req.connection;
    connection.commit(function (error) {
      (0, _logging.debugLog)("error: ", error);
      if (error) {
        connection.rollback(function () {
          next(error);
        });
      } else {
        (0, _logging.debugLog)("result:", req.records);
        var _receptEntry = req.receptEntry;
        var _billing = req.records;

        var result = _extends({}, _receptEntry, _billing);

        delete req.receptEntry;
        (0, _logging.debugLog)("OP result : ", result);
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
        next();
      }
    });
  }, _utils.releaseConnection);

  api.get("/getPatientwiseBill", _opCreditSettlement.getPatientwiseBill, function (req, res, next) {
    var result = req.records;
    if (result.length == 0) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  }, _utils.releaseConnection);

  /////
  return api;
};
//# sourceMappingURL=opCreditSettlement.js.map