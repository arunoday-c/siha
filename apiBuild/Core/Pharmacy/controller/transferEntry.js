"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _transferEntry = require("../model/transferEntry");

var _logging = require("../../utils/logging");

var _requisitionEntry = require("../model/requisitionEntry");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by Nowshad :to add Pharmacy POS Entry
  api.post("/addtransferEntry", _transferEntry.addtransferEntry, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to get Pos Entry
  api.get("/gettransferEntry", _transferEntry.gettransferEntry, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Storage and POS
  api.put("/updatetransferEntry", _utils.generateDbConnection, _transferEntry.updatetransferEntry, _requisitionEntry.updaterequisitionEntryOnceTranfer, function (req, res, next) {
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
  api.get("/getrequisitionEntryTransfer", _transferEntry.getrequisitionEntryTransfer, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=transferEntry.js.map