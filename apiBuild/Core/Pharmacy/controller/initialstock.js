"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _initialstock = require("../model/initialstock");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post("/addPharmacyInitialStock", _initialstock.addPharmacyInitialStock, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to getPharmacyInitialStock
  api.get("/getPharmacyInitialStock", _initialstock.getPharmacyInitialStock, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Storage
  api.put("/updatePharmacyInitialStock", _initialstock.updatePharmacyInitialStock, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=initialstock.js.map