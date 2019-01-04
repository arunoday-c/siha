"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _ReceiptEntry = require("../model/ReceiptEntry");

var _logging = require("../../utils/logging");

var _commonFunction = require("../../Pharmacy/model/commonFunction");

var _commonFunction2 = require("../../Inventory/model/commonFunction");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post("/addReceiptEntry", _utils.generateDbConnection, _ReceiptEntry.addReceiptEntry, _ReceiptEntry.updateDNEntry, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      if (error) {
        (0, _logging.debugLog)("Contorller: ", error);
        connection.rollback(function () {
          releaseDBConnection(db, connection);
          next(error);
        });
      } else {
        var result = req.records;
        (0, _logging.debugLog)("result: ", result);
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
        next();
      }
    });
  }, _utils.releaseConnection);

  // created by Nowshad :to getReceiptEntry
  api.get("/getReceiptEntry", _ReceiptEntry.getReceiptEntry, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Storage
  api.put("/updateReceiptEntry", _utils.generateDbConnection, _ReceiptEntry.updateReceiptEntry, function (req, res, next) {
    (0, _logging.debugLog)("phr.req.body", req.body);
    if (req.body.grn_for == "PHR") {
      (0, _commonFunction.updateIntoItemLocation)(req, res, next);
    } else {
      next();
    }
  }, function (req, res, next) {
    (0, _logging.debugLog)("inv.req.body", req.body);
    if (req.body.grn_for == "INV") {
      (0, _logging.debugLog)("Data Exist: ", "Yes");
      (0, _commonFunction2.updateIntoInvItemLocation)(req, res, next);
    } else {
      next();
    }
  }, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      if (error) {
        (0, _logging.debugLog)("Contorller: ", error);
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
    // let results = req.records;
    // res.status(httpStatus.ok).json({
    //   success: true,
    //   records: results
    // });
    // next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=ReceiptEntry.js.map