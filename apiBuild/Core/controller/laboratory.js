"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _laboratory = require("../model/laboratory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by nowshad : to get lab services in lab tables
  api.get("/getLabOrderedServices", _laboratory.getLabOrderedServices, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by nowshad : to get lab services in lab tables
  api.get("/getTestAnalytes", _laboratory.getTestAnalytes, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by nowshad : to insert lab services in lab tables
  api.post("/insertLadOrderedServices", _laboratory.insertLadOrderedServices, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.put("/updateLabOrderServices", _laboratory.updateLabOrderServices, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to update Lab Sample Status
  api.put("/updateLabSampleStatus", _laboratory.updateLabSampleStatus, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  //created by irfan: to update Lab Result Entry
  api.put("/updateLabResultEntry", _laboratory.updateLabResultEntry, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=laboratory.js.map