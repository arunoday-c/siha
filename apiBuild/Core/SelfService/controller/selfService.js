"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _selfService = require("../model/selfService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  //code

  // created by irfan :
  api.get("/getEmployeeBasicDetails", _selfService.getEmployeeBasicDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.get("/getEmployeeDependentDetails", _selfService.getEmployeeDependentDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.get("/getEmployeeIdentificationDetails", _selfService.getEmployeeIdentificationDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan
  api.put("/updateEmployeeIdentificationDetails", _selfService.updateEmployeeIdentificationDetails, function (req, res, next) {
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
  api.put("/updateEmployeeDependentDetails", _selfService.updateEmployeeDependentDetails, function (req, res, next) {
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
  api.put("/updateEmployeeBasicDetails", _selfService.updateEmployeeBasicDetails, function (req, res, next) {
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

  // created by Adnan :
  api.get("/getLeaveMaster", _selfService.getLeaveMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by IRFAN :
  api.post("/addEmployeeDependentDetails", _selfService.addEmployeeDependentDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by IRFAN :
  api.delete("/deleteEmployeeDependentDetails", _selfService.deleteEmployeeDependentDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=selfService.js.map