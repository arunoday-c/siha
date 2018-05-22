"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _frontDesk = require("../model/frontDesk");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  api.post("/add", _frontDesk.addFrontDesk, function (req, res, next) {
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: req.records
    });
    next();
  }, _utils.releaseConnection);
  api.get("/get", _frontDesk.selectFrontDesk, function (req, res, next) {
    if (req.records == null) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: req.records
      });
      next();
    }
  }, _utils.releaseConnection);
  return api;
};
//# sourceMappingURL=frontDesk.js.map