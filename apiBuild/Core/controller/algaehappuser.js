"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _algaehappuser = require("../model/algaehappuser");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.get("/selectAppUsers", _algaehappuser.selectAppUsers, function (req, res, next) {
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

  // created by irfan :
  api.get("/selectLoginUser", _algaehappuser.selectLoginUser, function (req, res, next) {
    var result = req.records;
    if (result.validUser == false) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.get("/selectAppGroup", _algaehappuser.selectAppGroup, function (req, res, next) {
    var result = req.records;
    if (result.validUser == false) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.get("/selectRoles", _algaehappuser.selectRoles, function (req, res, next) {
    var result = req.records;
    if (result.validUser == false) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }

    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.post("/createUserLogin", _algaehappuser.createUserLogin, function (req, res, next) {
    var result = req.records;
    if (result.validUser == false) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
    }
    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.get("/getLoginUserMaster", _algaehappuser.getLoginUserMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=algaehappuser.js.map