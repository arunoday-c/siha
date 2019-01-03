"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _shiftAndCounter = require("../model/shiftAndCounter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan :to  addShiftMaster
  api.post("/addShiftMaster", _shiftAndCounter.addShiftMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  addCounterMaster
  api.post("/addCounterMaster", _shiftAndCounter.addCounterMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  getCounterMaster
  api.get("/getCounterMaster", _shiftAndCounter.getCounterMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan :to  getShiftMaster
  api.get("/getShiftMaster", _shiftAndCounter.getShiftMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  updateCounterMaster
  api.put("/updateCounterMaster", _shiftAndCounter.updateCounterMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  updateShiftMaster
  api.put("/updateShiftMaster", _shiftAndCounter.updateShiftMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  getCashiers
  api.get("/getCashiers", _shiftAndCounter.getCashiers, function (req, res, next) {
    var result = req.records;
    if (result.validUser == false) {
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

  // created by irfan :to  getCashiers
  api.post("/addCashierToShift", _shiftAndCounter.addCashierToShift, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.get("/getCashiersAndShiftMAP", _shiftAndCounter.getCashiersAndShiftMAP, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan :to
  api.put("/updateCashiersAndShiftMAP", _shiftAndCounter.updateCashiersAndShiftMAP, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.delete("/deleteCashiersAndShiftMAP", _shiftAndCounter.deleteCashiersAndShiftMAP, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=shiftAndCounter.js.map