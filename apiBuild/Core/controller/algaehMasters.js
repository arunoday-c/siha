"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _algaehMasters = require("../model/algaehMasters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan :to add
  api.post("/addAlgaehGroupMAster", _algaehMasters.addAlgaehGroupMAster, function (req, res, next) {
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
  // created by irfan :to add
  api.post("/addAlgaehRoleMAster", _algaehMasters.addAlgaehRoleMAster, function (req, res, next) {
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

  // created by irfan :to add
  api.post("/addAlgaehModule", _algaehMasters.addAlgaehModule, function (req, res, next) {
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

  // created by irfan :to
  api.get("/getRoleBaseActiveModules", _algaehMasters.getRoleBaseActiveModules, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to add
  api.get("/getRoleBaseInActiveComponents", _algaehMasters.getRoleBaseInActiveComponents, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.get("/getAlgaehModules", _algaehMasters.getAlgaehModules, function (req, res, next) {
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
  api.get("/getAlgaehScreens", _algaehMasters.getAlgaehScreens, function (req, res, next) {
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
  api.post("/addAlgaehScreen", _algaehMasters.addAlgaehScreen, function (req, res, next) {
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
  api.post("/addAlgaehComponent", _algaehMasters.addAlgaehComponent, function (req, res, next) {
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
  api.get("/getAlgaehComponents", _algaehMasters.getAlgaehComponents, function (req, res, next) {
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
  api.post("/addAlgaehScreenElement", _algaehMasters.addAlgaehScreenElement, function (req, res, next) {
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
  api.get("/getAlgaehScreenElement", _algaehMasters.getAlgaehScreenElement, function (req, res, next) {
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
  api.get("/getFormulas", _algaehMasters.getFormulas, function (req, res, next) {
    var result = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });

    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.post("/addFormula", _algaehMasters.addFormula, function (req, res, next) {
    var result = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });

    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.put("/updateFormula", _algaehMasters.updateFormula, function (req, res, next) {
    var result = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });

    next();
  }, _utils.releaseConnection);

  // created by irfan :
  api.delete("/deleteFormula", _algaehMasters.deleteFormula, function (req, res, next) {
    var result = req.records;

    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });

    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=algaehMasters.js.map