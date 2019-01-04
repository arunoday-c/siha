"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add vendor master

//import moment from "moment";
var addVendorMaster = function addVendorMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_vendor` (vendor_code,vendor_name,bank_name,business_registration_no,email_id_1,email_id_2,website,\
          contact_number,payment_terms,payment_mode,vat_applicable,vat_percentage,  postal_code,address, country_id, state_id, city_id,\
          created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [input.vendor_code, input.vendor_name, input.bank_name, input.business_registration_no, input.email_id_1, input.email_id_2, input.website, input.contact_number, input.payment_terms, input.payment_mode, input.vat_applicable, input.vat_percentage, input.postal_code, input.address, input.country_id, input.state_id, input.city_id, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get vendor master

//import { LINQ } from "node-linq";
var getVendorMaster = function getVendorMaster(req, res, next) {
  var selectWhere = {
    hims_d_vendor_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    (0, _logging.debugLog)("where : ", where);
    db.getConnection(function (error, connection) {
      connection.query(" select hims_d_vendor_id, vendor_code, vendor_name, vendor_status, business_registration_no, email_id_1,\
        email_id_2, website, contact_number, payment_terms, payment_mode, vat_applicable, vat_percentage, bank_name,\
        postal_code,address, country_id, state_id, city_id from hims_d_vendor where record_status='A' and " + where.condition + " order by hims_d_vendor_id desc", where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to delete vendor master
var deleteVendorMaster = function deleteVendorMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_vendor",
      id: req.body.hims_d_vendor_id,
      query: "UPDATE hims_d_vendor SET  record_status='I' WHERE  record_status='A' and hims_d_vendor_id=?",
      values: [req.body.hims_d_vendor_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update vendor Master
var updateVendorMaster = function updateVendorMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("UPDATE `hims_d_vendor` SET  vendor_name=?,vendor_status=?,business_registration_no=?,email_id_1=?,email_id_2=?,website=?,\
        contact_number=?,payment_terms=?,payment_mode=?,vat_applicable=?,vat_percentage=?,bank_name=?,postal_code=?,address=?, country_id=?, state_id=?, city_id=?,\
        updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vendor_id`=?;", [input.vendor_name, input.vendor_status, input.business_registration_no, input.email_id_1, input.email_id_2, input.website, input.contact_number, input.payment_terms, input.payment_mode, input.vat_applicable, input.vat_percentage, input.bank_name, input.postal_code, input.address, input.country_id, input.state_id, input.city_id, new Date(), input.updated_by, input.hims_d_vendor_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan to
var makeVendorMasterInActive = function makeVendorMasterInActive(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_vendor",
      id: req.body.hims_d_vendor_id,
      query: "UPDATE hims_d_vendor SET  vendor_status='I' WHERE record_status='A' and hims_d_vendor_id=?",
      values: [req.body.hims_d_vendor_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addVendorMaster: addVendorMaster,
  getVendorMaster: getVendorMaster,
  updateVendorMaster: updateVendorMaster,
  deleteVendorMaster: deleteVendorMaster,
  makeVendorMasterInActive: makeVendorMasterInActive
};
//# sourceMappingURL=vendor.js.map