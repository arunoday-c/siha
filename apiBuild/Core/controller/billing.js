"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _billing = require("../model/billing");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.post("/billingCalculations", _billing.billingCalculations, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.post("/getBillDetails", _billing.getBillDetails, function (req, res, next) {
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

  // created by irfan : to get advance and to refund
  api.post("/patientAdvanceRefund", _billing.patientAdvanceRefund, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to add episode and encounter
  api.post("/addEpisodeEncounter", _billing.addEpisodeEncounter, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.post("/addCashHandover", _billing.addCashHandover, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=billing.js.map