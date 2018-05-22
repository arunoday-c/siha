"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _department = require("../model/department");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  api.post("/add", _department.addDepartment, function (req, res, next) {
    var resultTables = req.records;
    if (resultTables.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultTables
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No more records"));
    }
  }, _utils.releaseConnection);
  api.put("/update", _department.updateDepartment, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  api.get("/get", _department.selectDepartment, function (req, res, next) {
    var result = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.get("/get/subdepartment", _department.selectSubDepartment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.post("/add/subdepartment", _department.addSubDepartment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.put("/update/subdepartment", _department.updateSubDepartment, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);
  api.delete("/delete", _department.deleteDepartment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=department.js.map