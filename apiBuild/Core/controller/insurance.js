"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _insurance = require("../model/insurance");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan : to fetch insurence based on patient id
  api.get("/getPatientInsurance", _insurance.getPatientInsurance, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by nowshad : to fetch sub insurence
  api.get("/getSubInsurance", _insurance.getSubInsurance, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to save insurence of patient in DB
  api.post("/addPatientInsurance", _insurance.addPatientInsurance, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to get all insurence provider  company details
  api.get("/getListOfInsuranceProvider", _insurance.getListOfInsuranceProvider, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add insurence provider
  api.post("/addInsuranceProvider", _insurance.addInsuranceProvider, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to update insurence provider
  api.put("/updateInsuranceProvider", _insurance.updateInsuranceProvider, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add SUB-insurence provider
  api.post("/addSubInsuranceProvider", _insurance.addSubInsuranceProvider, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to update SUB-insurence provider
  api.put("/updateSubInsuranceProvider", _insurance.updateSubInsuranceProvider, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add network(insurence plan)
  api.post("/addNetwork", _insurance.addNetwork, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add network office(insurence policy)
  api.post("/NetworkOfficeMaster", _insurance.NetworkOfficeMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan: to add  both network and network office(insurence plan master)
  api.post("/addPlanAndPolicy", _insurance.addPlanAndPolicy, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan: to delete sub insurance
  api.delete("/deleteSubInsurance", _insurance.deleteSubInsurance, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Noushad : to get all price list of selected insurance
  api.get("/getPriceList", _insurance.getPriceList, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan : to get list of network and its network_office records
  // based on insuranceProvider id
  api.get("/getNetworkAndNetworkOfficRecords", _insurance.getNetworkAndNetworkOfficRecords, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.put("/updatePriceList", _insurance.updatePriceList, function (req, res, next) {
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

  // created by irfan : to  update Network And NetworkOffice
  api.put("/updateNetworkAndNetworkOffice", _insurance.updateNetworkAndNetworkOffice, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad : to  update bulk Services price list
  api.put("/updatePriceListBulk", _insurance.updatePriceListBulk, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad : to  update bulk Services price list
  api.put("/deleteNetworkAndNetworkOfficRecords", _insurance.deleteNetworkAndNetworkOfficRecords, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan
  api.get("/getInsuranceProviders", _insurance.getInsuranceProviders, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  });

  //created by Adnan
  api.get("/getSubInsuraces", _insurance.getSubInsuraces, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
//# sourceMappingURL=insurance.js.map