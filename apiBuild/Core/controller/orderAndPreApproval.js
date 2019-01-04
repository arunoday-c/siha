"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

var _orderAndPreApproval = require("../model/orderAndPreApproval");

var _radiology = require("../model/radiology");

var _laboratory = require("../model/laboratory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan: to  insertOrderedServices
  api.post("/insertOrderedServices", _utils.generateDbConnection, _orderAndPreApproval.insertOrderedServices, _laboratory.insertLadOrderedServices, _radiology.insertRadOrderedServices, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      (0, _logging.debugLog)("error", error);
      (0, _logging.debugLog)("commit error", error);
      if (error) {
        (0, _logging.debugLog)("roll error", error);
        connection.rollback(function () {
          next(error);
        });
      } else {
        var result = req.records;
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
        next();
      }
    });
  }, _utils.releaseConnection);

  // created by irfan : to fetch pre approval list
  api.get("/getPreAprovalList", _orderAndPreApproval.getPreAprovalList, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  //created by irfan :to update preApproal
  api.put("/updatePreApproval", _orderAndPreApproval.updatePreApproval, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by Nowshad :to get Ordered Services which to bill
  api.get("/selectOrderServices", _orderAndPreApproval.selectOrderServices, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by Nowshad :to get Ordered Services to Display
  api.get("/getOrderServices", _orderAndPreApproval.getOrderServices, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan :to update OrderedServices
  api.put("/updateOrderedServices", _orderAndPreApproval.updateOrderedServices, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by Nowshad :to update OrderedServices as billed
  api.put("/updateOrderedServicesBilled", _orderAndPreApproval.updateOrderedServicesBilled, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=orderAndPreApproval.js.map