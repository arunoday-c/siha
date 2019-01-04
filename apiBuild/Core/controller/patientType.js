"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _logging = require("../utils/logging");

var _patientType = require("../model/patientType");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.delete("/delete", _patientType.deletePatientType, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/get", _patientType.selectPattypeStatement, function (req, res, next) {
    (0, _logging.debugLog)("Data: ", req.records);
    var result = void 0;
    if (req.records !== undefined) {
      result = new Object();
      result["totalPages"] = req.records[1][0].total_pages;
      result["data"] = req.records[0];
    }
    (0, _logging.debugLog)("Data: ", result);
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getPatientType", _patientType.getPatientType, function (req, res, next) {
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

  api.post("/add", _patientType.addPatientType, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  api.put("/update", _patientType.updatePatientType, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  return api;
};
//# sourceMappingURL=patientType.js.map