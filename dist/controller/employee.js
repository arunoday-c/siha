"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _employee = require("../model/employee");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  api.post("/add", _employee.addEmployee, function (req, res, next) {
    var resultBack = req.records;
    if (resultBack.length == 0) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No record found"));
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultBack
      });
    }

    next();
  }, _utils.releaseConnection);
  api.put("/update", _employee.updateEmployee, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      message: "Updated successfully",
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.get("/get", _employee.getEmployee, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  return api;
};
//# sourceMappingURL=employee.js.map