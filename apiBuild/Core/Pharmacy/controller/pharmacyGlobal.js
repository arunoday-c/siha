"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _pharmacyGlobal = require("../model/pharmacyGlobal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan :get global
  api.get("/getUomLocationStock", _pharmacyGlobal.getUomLocationStock, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :get global
  api.get("/getVisitPrescriptionDetails", _pharmacyGlobal.getVisitPrescriptionDetails, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :get Item Moment
  api.get("/getItemMoment", _pharmacyGlobal.getItemMoment, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :get item batch for selcted location
  api.get("/getItemLocationStock", _pharmacyGlobal.getItemLocationStock, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :get item batch for selcted location
  api.get("/getItemandLocationStock", _pharmacyGlobal.getItemandLocationStock, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :get item batch for selcted location
  api.get("/getUserLocationPermission", _pharmacyGlobal.getUserLocationPermission, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=pharmacyGlobal.js.map