"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _leave = require("../model/leave");

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  //code

  // created by irfan :
  api.get("/getEmployeeLeaveData", _leave.getEmployeeLeaveData, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.post("/applyEmployeeLeave", _leave.applyEmployeeLeave, function (req, res, next) {
    var result = req.records;

    if (result.leave_already_exist == true) {
      (0, _logging.debugLog)("erooooo");
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });
    } else {
      (0, _logging.debugLog)("Suuuuuuuuccc");
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }

    next();
  }, _utils.releaseConnection);

  // created by irfan
  api.get("/getEmployeeLeaveHistory", _leave.getEmployeeLeaveHistory, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.post("/getLeaveBalance", _leave.getLeaveBalance, function (req, res, next) {
    var result = req.records;
    if (result.leave_already_exist == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });
  return api;
};
//# sourceMappingURL=leave.js.map