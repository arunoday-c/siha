"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _languageTranslator = require("../model/languageTranslator");

var _index = require("../utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var api = (0, _express.Router)();
  api.post("/", _languageTranslator.getTargetLangage, function (req, res, next) {
    var result = req.records;
    if (result == null) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records translated.."));
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    }
  }, _index.releaseConnection);
  return api;
};
//# sourceMappingURL=languageTranslator.js.map