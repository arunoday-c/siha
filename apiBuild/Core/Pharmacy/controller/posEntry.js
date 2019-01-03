"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _posEntry = require("../model/posEntry");

var _logging = require("../../utils/logging");

var _pharmacyGlobal = require("../model/pharmacyGlobal");

var _receiptentry = require("../../model/receiptentry");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by Nowshad :to add Pharmacy POS Entry
  api.post("/addPosEntry", _utils.generateDbConnection, _pharmacyGlobal.pharmacyReceiptInsert, _posEntry.addPosEntry, _posEntry.updatePosEntry, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      (0, _logging.debugLog)("error", error);
      (0, _logging.debugLog)("commit error", error);
      if (error) {
        (0, _logging.debugLog)("roll error", error);
        connection.rollback(function () {
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

  // created by Nowshad :to get Pos Entry
  api.get("/getPosEntry", _utils.generateDbConnection, _posEntry.getPosEntry, _receiptentry.getReceiptEntry, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      (0, _logging.debugLog)("error", error);
      (0, _logging.debugLog)("commit error", error);
      if (error) {
        (0, _logging.debugLog)("roll error", error);
        connection.rollback(function () {
          next(error);
        });
      } else {
        var _receptEntry = req.receptEntry;
        var _pos = req.records;

        var result = _extends({}, _receptEntry, _pos);
        (0, _logging.debugLog)("result : ", result);

        delete req.receptEntry;
        delete req.pos;
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
        next();
      }
    });
    // let result = req.records;
    // res.status(httpStatus.ok).json({
    //   success: true,
    //   records: result
    // });
    // next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Storage and POS
  api.put("/updatePosEntry", _posEntry.updatePosEntry, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to get Prescription POS
  api.post("/getPrescriptionPOS", _posEntry.getPrescriptionPOS, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=posEntry.js.map