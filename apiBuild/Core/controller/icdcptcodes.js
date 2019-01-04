"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _icdcptcodes = require("../model/icdcptcodes");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.delete("/deleteIcdcptCodes", _icdcptcodes.deleteIcdcptCodes, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/selectIcdcptCodes", _icdcptcodes.selectIcdcptCodes, function (req, res, next) {
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
  api.post("/insertIcdcptCodes", _icdcptcodes.insertIcdcptCodes, function (req, res, next) {
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
  api.put("/updateIcdcptCodes", _icdcptcodes.updateIcdcptCodes, function (req, res, next) {
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

  api.delete("/deleteCptCodes", _icdcptcodes.deleteCptCodes, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/selectCptCodes", _icdcptcodes.selectCptCodes, function (req, res, next) {
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
  api.post("/insertCptCodes", _icdcptcodes.insertCptCodes, function (req, res, next) {
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
  api.put("/updateCptCodes", _icdcptcodes.updateCptCodes, function (req, res, next) {
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
//# sourceMappingURL=icdcptcodes.js.map