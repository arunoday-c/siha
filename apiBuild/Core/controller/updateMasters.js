"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mastersUpdate = require("../model/mastersUpdate");

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var api = (0, _express.Router)();

  api.delete("/delete/visa", _mastersUpdate.deleteVisa, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.post("/autogen", _mastersUpdate.insertToAppgen, function (req, res, next) {
    var result = req.records;
    if (result == null) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notModified, "no record updated"));
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    }
  }, _utils.releaseConnection);
  api.put("/update/autogen", _mastersUpdate.updateToAppgen, function (req, res, next) {
    var result = req.records;
    if (result == null) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notModified, "no record updated"));
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    }
  }, _utils.releaseConnection);
  api.post("/add/visa", _mastersUpdate.addVisa, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notModified, "no record updated"));
    }
  }, _utils.releaseConnection);

  api.put("/update/visa", _mastersUpdate.updateVisa, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notModified, "no record updated"));
    }
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=updateMasters.js.map