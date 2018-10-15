"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//import extend from "extend";


var _express = require("express");

var _images = require("../utils/images");

var _utils = require("../utils");

var _logging = require("../utils/logging");

var _frontDesk = require("../model/frontDesk");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  api.post("/add", _frontDesk.addFrontDesk, function (req, res, next) {
    (0, _logging.debugLog)("Data: ", req.body.patient_Image);
    (0, _logging.debugLog)("req.body: ", req.body);
    if (req.body.patient_Image != null) {
      (0, _logging.debugLog)("Download Image : ");
      (0, _images.downloadImage)(req.body.patient_Image, req.body.patient_code, req.body.patient_code);
      delete req.body.patient_Image;
    }
    next();
  }, function (req, res, next) {
    (0, _logging.debugLog)("Data1:");
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: req.body
    });
    next();
  }, _utils.releaseConnection);

  api.post("/update", _frontDesk.updateFrontDesk, function (req, res, next) {
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: req.body
    });
    next();
  }, _utils.releaseConnection);

  api.get("/get", _frontDesk.selectFrontDesk, function (req, res, next) {
    if (req.records == null) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    } else {
      var patient_Image = (0, _images.readFileToBase64)(req.query.patient_code, req.query.patient_code);
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: _extends({}, req.records, { patient_Image: patient_Image })
      });
      next();
    }
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=frontDesk.js.map