"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _visit = require("../model/visit");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  api.post("/addVisit", _visit.addVisit, function (req, res, next) {
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: req.records
    });
    next();
  }, _utils.releaseConnection);

  api.post("/checkVisitExists", _visit.checkVisitExists, function (req, res, next) {
    res.status(_httpStatus2.default.ok).json({
      success: req.records.length == 0 ? true : false,
      message: req.records.length != 0 ? "Visit already exists for same doctor" : ""
    });
    next();
  }, _utils.releaseConnection);

  api.post("/closeVisit", _visit.closeVisit, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=visit.js.map