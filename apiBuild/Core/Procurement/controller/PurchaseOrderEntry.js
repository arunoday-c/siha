"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _PurchaseOrderEntry = require("../model/PurchaseOrderEntry");

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post("/addPurchaseOrderEntry", _utils.generateDbConnection, _PurchaseOrderEntry.addPurchaseOrderEntry, function (req, res, next) {
    (0, _logging.debugLog)("phr.req.body", req.body);
    if (req.body.po_from == "PHR" && req.body.phar_requisition_id != null) {
      (0, _PurchaseOrderEntry.updatePharReqEntry)(req, res, next);
    } else {
      next();
    }
  }, function (req, res, next) {
    (0, _logging.debugLog)("inv.req.body", req.body);
    if (req.body.po_from == "INV" && req.body.inv_requisition_id != null) {
      (0, _logging.debugLog)("Data Exist: ", "Yes");
      (0, _PurchaseOrderEntry.updateInvReqEntry)(req, res, next);
    } else {
      next();
    }
  }, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      if (error) {
        connection.rollback(function () {
          releaseDBConnection(db, connection);
          next(error);
        });
      } else {
        var result = req.records;
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
        next();
      }
    });
  }, _utils.releaseConnection);

  // created by Nowshad :to getPharmacyInitialStock
  api.get("/getPurchaseOrderEntry", _PurchaseOrderEntry.getPurchaseOrderEntry, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to getAuthrequisitionList
  api.get("/getAuthPurchaseList", _PurchaseOrderEntry.getAuthPurchaseList, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to get Pharmacy RequisitionEntry for PO
  api.get("/getPharRequisitionEntryPO", _PurchaseOrderEntry.getPharRequisitionEntryPO, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to get Inventory RequisitionEntry for PO
  api.get("/getInvRequisitionEntryPO", _PurchaseOrderEntry.getInvRequisitionEntryPO, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Storage
  api.put("/updatePurchaseOrderEntry", _PurchaseOrderEntry.updatePurchaseOrderEntry, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=PurchaseOrderEntry.js.map