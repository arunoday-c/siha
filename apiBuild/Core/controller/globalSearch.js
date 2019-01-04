"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _globalSearch = require("../model/globalSearch");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var api = (0, _express.Router)();
  api.get("/get", _globalSearch.searchData, function (req, res, next) {
    var result = void 0;
    if (req.records !== undefined) {
      result = new Object();
      result["totalPages"] = req.records[1][0].total_pages;
      result["data"] = req.records[0];
    }
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  return api;
};
//# sourceMappingURL=globalSearch.js.map