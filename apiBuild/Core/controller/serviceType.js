"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _serviceTypes = require("../model/serviceTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  api.get("/", _serviceTypes.getServiceType, function (req, res, next) {
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: req.records
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getService", _serviceTypes.getServices, function (req, res, next) {
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addServices", _serviceTypes.addServices, function (req, res, next) {
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

  api.put("/updateServices", _serviceTypes.updateServices, function (req, res, next) {
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
//# sourceMappingURL=serviceType.js.map