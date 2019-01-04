"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _DeliveryNoteEntry = require("../model/DeliveryNoteEntry");

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post("/addDeliveryNoteEntry", _utils.generateDbConnection, _DeliveryNoteEntry.addDeliveryNoteEntry, _DeliveryNoteEntry.updatePOEntry, function (req, res, next) {
    var connection = req.connection;
    connection.commit(function (error) {
      if (error) {
        (0, _logging.debugLog)("Contorller: ", error);
        connection.rollback(function () {
          releaseDBConnection(db, connection);
          next(error);
        });
      } else {
        var result = req.records;
        (0, _logging.debugLog)("result: ", result);
        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: result
        });
        next();
      }
    });
  }, _utils.releaseConnection);

  // created by Nowshad :to getDeliveryNoteEntry
  api.get("/getDeliveryNoteEntry", _DeliveryNoteEntry.getDeliveryNoteEntry, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :to getAuthrequisitionList
  api.get("/getAuthPurchaseList", _DeliveryNoteEntry.getAuthPurchaseList, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad :update Item Storage
  api.put("/updateDeliveryNoteEntry", _DeliveryNoteEntry.updateDeliveryNoteEntry, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=DeliveryNoteEntry.js.map