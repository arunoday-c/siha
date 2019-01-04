"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _organization = require("../model/organization");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.get("/getOrganization", _organization.getOrganization, function (req, res, next) {
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

  return api;
};
//# sourceMappingURL=organization.js.map