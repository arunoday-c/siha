"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _holiday = require("../model/holiday");

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan :
  api.post("/addWeekOffs", _holiday.addWeekOffs, function (req, res, next) {
    var result = req.records;

    if (result.weekOff_exist == true) {
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
  }, _utils.releaseConnection);

  // created by irfan :
  api.get("/getAllHolidays", _holiday.getAllHolidays, function (req, res, next) {
    var result = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });

    next();
  }, _utils.releaseConnection);

  // created by irfan :

  api.post("/addHoliday", _holiday.addHoliday, function (req, res, next) {
    var result = req.records;

    if (result.holiday_exist == true) {
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
  }, _utils.releaseConnection);

  // created by irfan
  api.delete("/deleteHoliday", _holiday.deleteHoliday, function (req, res, next) {
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

  return api;
};
//# sourceMappingURL=holiday.js.map