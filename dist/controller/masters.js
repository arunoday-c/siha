"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _masters = require("../model/masters");

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _caching = require("../utils/caching");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var api = (0, _express.Router)();

  api.get("/subDeptClinicalNonClinicalAll", function (req, res, next) {
    (0, _caching.getCacheData)({ key: "subDeptClinicalNonClinicalAll" }, function (result) {
      if (result != null) {
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
      } else {
        next();
      }
    });
  }, _masters.clinicalNonClinicalAll, function (req, res, next) {
    var result = req.records;
    (0, _caching.setCacheData)({
      key: "subDeptClinicalNonClinicalAll",
      value: result
    }, function (resultData) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultData
      });
      next();
    });
  }, _utils.releaseConnection);

  api.get("/visa", function (req, res, next) {
    (0, _caching.getCacheData)({ key: "visa" }, function (result) {
      if (result != null) {
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
      } else {
        next();
      }
    });
  }, _masters.visaMaster, function (req, res, next) {
    var result = req.records;
    (0, _caching.setCacheData)({
      key: "visa",
      value: result
    }, function (resultData) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultData
      });
      next();
    });
  }, _utils.releaseConnection);

  api.get("/title", function (req, res, next) {
    (0, _caching.getCacheData)({ key: "title" }, function (result) {
      if (result != null) {
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
      } else {
        next();
      }
    });
  }, _masters.titleMaster, function (req, res, next) {
    var result = req.records;

    (0, _caching.setCacheData)({
      key: "title",
      value: result
    }, function (resultData) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultData
      });
      next();
    });
  }, _utils.releaseConnection);
  api.get("/country", _masters.countryMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/state", _masters.stateMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/city", _masters.cityMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  api.get("/countryStateCity", function (req, res, next) {
    var masterDir = _path2.default.join(__dirname, "../../Masters/countryStateCity.json");
    if (_fs2.default.existsSync(masterDir)) {
      res.status(_httpStatus2.default.ok).json({
        records: JSON.parse(_fs2.default.readFileSync(masterDir)),
        success: true
      });
    } else {
      (0, _masters.countryStateCity)(req, res, next);
    }
  }, function (req, res, next) {
    var result = void 0;
    if (req.records != null) {
      if (req.records.length != 0) {
        result = new _nodeLinq.LINQ(req.records[0]).SelectMany(function (items) {
          return {
            hims_d_country_id: items.hims_d_country_id,
            country_name: items.country_name,
            arabic_country_name: items.arabic_country_name,
            states: new _nodeLinq.LINQ(req.records[1]).Where(function (state) {
              return state.country_id == items.hims_d_country_id;
            }).Select(function (s) {
              return {
                hims_d_state_id: s.hims_d_state_id,
                state_name: s.state_name,
                country_id: s.country_id,
                cities: new _nodeLinq.LINQ(req.records[2]).Where(function (c) {
                  return c.state_id == s.hims_d_state_id;
                }).ToArray()
              };
            }).ToArray()
          };
        }).ToArray();
      }
      (0, _utils.bulkMasters)("countryStateCity", result);
      res.status(_httpStatus2.default.ok).json({
        records: result,
        success: true
      });
      next();
    }
  }, _utils.releaseConnection);
  api.get("/relegion", function (req, res, next) {
    (0, _caching.getCacheData)({ key: "relegion" }, function (result) {
      if (result != null) {
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
      } else {
        next();
      }
    });
  }, _masters.relegionMaster, function (req, res, next) {
    var result = req.records;

    (0, _caching.setCacheData)({
      key: "relegion",
      value: result
    }, function (resultData) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultData
      });
      next();
    });
  }, _utils.releaseConnection);

  api.get("/nationality", function (req, res, next) {
    (0, _caching.getCacheData)({ key: "nationality" }, function (result) {
      if (result != null) {
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
      } else {
        next();
      }
    });
  }, _masters.nationalityMaster, function (req, res, next) {
    var result = req.records;
    (0, _caching.setCacheData)({
      key: "nationality",
      value: result
    }, function (resultData) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultData
      });
      next();
    });
  }, _utils.releaseConnection);
  api.get("/autogen", _masters.autoGenMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  return api;
};
//# sourceMappingURL=masters.js.map