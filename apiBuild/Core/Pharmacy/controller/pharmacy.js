"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _pharmacy = require("../model/pharmacy");

var _serviceTypes = require("../../model/serviceTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan :to add Item Master
  api.post("/addItemMaster", _serviceTypes.addServices, _pharmacy.addItemMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan :to add Item Category
  api.post("/addItemCategory", _pharmacy.addItemCategory, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan :to add ItemGeneric
  api.post("/addItemGeneric", _pharmacy.addItemGeneric, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  addItemGroup
  api.post("/addItemGroup", _pharmacy.addItemGroup, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  add PharmacyUom
  api.post("/addPharmacyUom", _pharmacy.addPharmacyUom, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  add Pharmacy Location
  api.post("/addPharmacyLocation", _pharmacy.addPharmacyLocation, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to  add Item Storage
  api.post("/addItemStorage", _pharmacy.addItemStorage, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to  add Location Permission
  api.post("/addLocationPermission", _pharmacy.addLocationPermission, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to  add Item Form
  api.post("/addItemForm", _pharmacy.addItemForm, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to getItemMaster
  api.get("/getItemMaster", _pharmacy.getItemMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to getItemCategory
  api.get("/getItemCategory", _pharmacy.getItemCategory, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to getItemGeneric
  api.get("/getItemGeneric", _pharmacy.getItemGeneric, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to  getItemGroup
  api.get("/getItemGroup", _pharmacy.getItemGroup, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to getPharmacyUom
  api.get("/getPharmacyUom", _pharmacy.getPharmacyUom, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan :to getItemMasterAndItemUom
  api.get("/getItemMasterAndItemUom", _pharmacy.getItemMasterAndItemUom, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to getPharmacyLocation
  api.get("/getPharmacyLocation", _pharmacy.getPharmacyLocation, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to Item Storage
  api.get("/getItemStorage", _pharmacy.getItemStorage, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to Item Form
  api.get("/getItemForm", _pharmacy.getItemForm, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to get Location Permission
  api.get("/getLocationPermission", _pharmacy.getLocationPermission, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Item Category
  api.put("/updateItemCategory", _pharmacy.updateItemCategory, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Item Group
  api.put("/updateItemGroup", _pharmacy.updateItemGroup, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Item Generic
  api.put("/updateItemGeneric", _pharmacy.updateItemGeneric, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Pharmacy Uom
  api.put("/updatePharmacyUom", _pharmacy.updatePharmacyUom, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Pharmacy Location
  api.put("/updatePharmacyLocation", _pharmacy.updatePharmacyLocation, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Form
  api.put("/updateItemForm", _pharmacy.updateItemForm, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Storage
  api.put("/updateItemStorage", _pharmacy.updateItemStorage, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Item Storage
  api.put("/updateItemMasterAndUom", _pharmacy.updateItemMasterAndUom, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Location Permission
  api.put("/updateLocationPermission", _pharmacy.updateLocationPermission, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  return api;
};

// import { addServices } from "../../model/serviceTypes/addServices";
//# sourceMappingURL=pharmacy.js.map