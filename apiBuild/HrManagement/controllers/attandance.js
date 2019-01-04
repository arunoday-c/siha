"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _AlgaehUtilities = require("../../../AlgaehUtilities");

var _AlgaehUtilities2 = _interopRequireDefault(_AlgaehUtilities);

var _attendance = require("../models/attendance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var api = (0, _express.Router)();
  api.get("/processAttendance", _attendance.processAttendance, function (req, res, next) {
    res.status(_AlgaehUtilities2.default.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
//# sourceMappingURL=attandance.js.map