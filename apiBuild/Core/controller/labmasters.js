"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _labmasters = require("../model/labmasters");

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var api = (0, _express.Router)();

  //Section
  api.delete("/deleteSection", _labmasters.deleteSection, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/selectSection", _labmasters.selectSection, function (req, res, next) {
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

  api.post("/insertSection", _labmasters.insertSection, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  api.put("/updateSection", _labmasters.updateSection, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  //Container
  api.delete("/deleteContainer", _labmasters.deleteContainer, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/selectContainer", _labmasters.selectContainer, function (req, res, next) {
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

  api.post("/insertContainer", _labmasters.insertContainer, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  api.put("/updateContainer", _labmasters.updateContainer, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  //Specimen
  api.delete("/deleteSpecimen", _labmasters.deleteSpecimen, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/selectSpecimen", _labmasters.selectSpecimen, function (req, res, next) {
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

  api.post("/insertSpecimen", _labmasters.insertSpecimen, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  api.put("/updateSpecimen", _labmasters.updateSpecimen, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  //Analyte
  api.delete("/deleteAnalytes", _labmasters.deleteAnalytes, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/selectTestCategory", _labmasters.selectTestCategory, function (req, res, next) {
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

  api.post("/insertAnalytes", _labmasters.insertAnalytes, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  api.put("/updateAnalytes", _labmasters.updateAnalytes, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  //TestCategory
  api.delete("/deleteTestCategory", _labmasters.deleteTestCategory, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json(result);
    next();
  }, _utils.releaseConnection);

  api.get("/selectAnalytes", _labmasters.selectAnalytes, function (req, res, next) {
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

  api.post("/insertTestCategory", _labmasters.insertTestCategory, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  api.put("/updateTestCategory", _labmasters.updateTestCategory, function (req, res, next) {
    var result = req.records;
    if (result.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=labmasters.js.map