"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _dental = require("../model/dental");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan :to
  api.post("/addTreatmentPlan", _dental.addTreatmentPlan, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.post("/addDentalTreatment", _dental.addDentalTreatment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.get("/getTreatmentPlan", _dental.getTreatmentPlan, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.get("/getDentalTreatment", _dental.getDentalTreatment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.put("/approveTreatmentPlan", _dental.approveTreatmentPlan, function (req, res, next) {
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
  }, _utils.releaseConnection);

  // created by irfan :to
  api.delete("/deleteDentalPlan", _dental.deleteDentalPlan, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });

    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.put("/updateDentalPlanStatus", _dental.updateDentalPlanStatus, function (req, res, next) {
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
  }, _utils.releaseConnection);

  // created by irfan :to
  api.put("/updateDentalTreatmentStatus", _dental.updateDentalTreatmentStatus, function (req, res, next) {
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
  }, _utils.releaseConnection);

  // created by irfan :to
  api.put("/updateDentalTreatmentBilledStatus", _dental.updateDentalTreatmentBilledStatus, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else if (result.affectedRows == 0) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "records doesn't match"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.put("/updateDentalTreatment", _dental.updateDentalTreatment, function (req, res, next) {
    var result = req.records;
    if (result.invalid_input == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else if (result.affectedRows == 0) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: "records doesn't match"
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  }, _utils.releaseConnection);
  return api;
};
//# sourceMappingURL=dental.js.map