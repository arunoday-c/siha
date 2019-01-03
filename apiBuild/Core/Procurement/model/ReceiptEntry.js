"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require("../../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _nodeLinq = require("node-linq");

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by Nowshad: to save Receipt Entry
var addReceiptEntry = function addReceiptEntry(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    (0, _logging.debugLog)("ReceiptEntry: ", "Delivery Note Entry");
    var connection = req.connection;

    var requestCounter = 1;

    return new _bluebird2.default(function (resolve, reject) {
      (0, _utils.runningNumberGen)({
        db: connection,
        counter: requestCounter,
        module_desc: ["RE_NUM"],
        onFailure: function onFailure(error) {
          reject(error);
        },
        onSuccess: function onSuccess(result) {
          resolve(result);
        }
      });
    }).then(function (result) {
      var documentCode = result[0].completeNumber;

      (0, _logging.debugLog)("documentCode:", documentCode);

      var today = (0, _moment2.default)().format("YYYY-MM-DD");
      (0, _logging.debugLog)("today:", today);

      var year = (0, _moment2.default)().format("YYYY");
      (0, _logging.debugLog)("onlyyear:", year);

      var period = (0, _moment2.default)().format("MM");
      (0, _logging.debugLog)("period:", period);

      connection.query("INSERT INTO `hims_f_procurement_grn_header` (grn_number,grn_date, grn_for, `year`, period, pharmcy_location_id,\
              inventory_location_id,location_type,vendor_id, po_id, dn_id, payment_terms, comment, description, sub_total, \
              detail_discount, extended_total,sheet_level_discount_percent, sheet_level_discount_amount,\
              net_total,total_tax, net_payable, additional_cost,reciept_total, created_by,created_date, \
              updated_by,updated_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [documentCode, today, input.grn_for, year, period, input.pharmcy_location_id, input.inventory_location_id, input.location_type, input.vendor_id, input.po_id, input.dn_id, input.payment_terms, input.comment, input.description, input.sub_total, input.detail_discount, input.extended_total, input.sheet_level_discount_percent, input.sheet_level_discount_amount, input.net_total, input.total_tax, input.net_payable, input.additional_cost, input.reciept_total, req.userIdentity.algaeh_d_app_user_id, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date()], function (error, headerResult) {
        if (error) {
          (0, _logging.debugLog)("error: ", "Check");
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        (0, _logging.debugLog)(" pos header id :", headerResult);

        if (headerResult.insertId != null) {
          var insurtColumns = ["phar_item_category", "phar_item_group", "phar_item_id", "inv_item_category_id", "inv_item_group_id", "inv_item_id", "po_quantity", "dn_quantity", "recieved_quantity", "pharmacy_uom_id", "inventory_uom_id", "unit_cost", "extended_cost", "discount_percentage", "discount_amount", "net_extended_cost", "tax_percentage", "tax_amount", "total_amount", "batchno_expiry_required", "batchno", "expiry_date"];

          connection.query("INSERT INTO hims_f_procurement_grn_detail(" + insurtColumns.join(",") + ",grn_header_id) VALUES ?", [(0, _utils.jsonArrayToObject)({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.dn_entry_detail,
            newFieldToInsert: [headerResult.insertId],
            req: req
          })], function (error, detailResult) {
            if (error) {
              (0, _logging.debugLog)("Error: ", error);

              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            req.records = {
              grn_number: documentCode,
              hims_f_procurement_grn_header_id: headerResult.insertId,
              year: year,
              period: period
            };
            next();
          });
        } else {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
      });
    });
    // });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get ReceiptEntry
var getReceiptEntry = function getReceiptEntry(req, res, next) {
  var selectWhere = {
    grn_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    (0, _logging.debugLog)("where", where);
    db.getConnection(function (error, connection) {
      connection.query("SELECT * from  hims_f_procurement_grn_header\
          where " + where.condition, where.values, function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        if (headerResult.length != 0) {
          (0, _logging.debugLog)("hims_f_procurement_grn_header_id: ", headerResult[0].hims_f_procurement_grn_header_id);
          connection.query("select * from hims_f_procurement_grn_detail where grn_header_id=?", headerResult[0].hims_f_procurement_grn_header_id, function (error, receipt_entry_detail) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = _extends({}, headerResult[0], { receipt_entry_detail: receipt_entry_detail });
            (0, _utils.releaseDBConnection)(db, connection);
            next();
          });
        } else {
          req.records = headerResult;
          (0, _utils.releaseDBConnection)(db, connection);
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

var updateReceiptEntry = function updateReceiptEntry(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     next(error);
    //   }
    var connection = req.connection;
    connection.beginTransaction(function (error) {
      if (error) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      }
      var inputParam = (0, _extend2.default)({}, req.body);
      (0, _logging.debugLog)("req.body: ", req.body);

      connection.query("UPDATE `hims_f_procurement_grn_header` SET `posted`=?, `posted_date`=?, `posted_by`=? \
      WHERE `hims_f_procurement_grn_header_id`=?", [inputParam.posted, new Date(), req.userIdentity.algaeh_d_app_user_id, inputParam.hims_f_procurement_grn_header_id], function (error, result) {
        (0, _logging.debugLog)("result: ", result);
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        if (result !== "" && result != null) {
          var details = inputParam.receipt_entry_detail;

          var qry = "";

          for (var i = 0; i < details.length; i++) {
            qry += " UPDATE `hims_f_procurement_grn_detail` SET recieved_quantity='" + details[i].recieved_quantity + "',batchno='" + details[i].batchno + "',rejected_quantity='" + (details[i].rejected_quantity || 0) + "',outstanding_quantity='" + (details[i].outstanding_quantity || 0);

            if (details[i].expiry_date != null) {
              qry += "',expiry_date='" + (details[i].expiry_date || null);
            }
            qry += "' WHERE hims_f_procurement_grn_detail_id='" + details[i].hims_f_procurement_grn_detail_id + "';";
          }
          (0, _logging.debugLog)("qry: ", qry);

          if (qry != "") {
            connection.query(qry, function (error, detailResult) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
              req.records = detailResult;
              next();
              // connection.commit(error => {
              //   if (error) {
              //     connection.rollback(() => {
              //       releaseDBConnection(db, connection);
              //       next(error);
              //     });
              //   }
              //   releaseDBConnection(db, connection);
              //   req.records = detailResult;
              //   next();
              // });
            });
          } else {
            (0, _utils.releaseDBConnection)(db, connection);
            req.records = {};
            next();
          }
        } else {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            req.records = {};
            next();
          });
        }
      });
    });
    // });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Update PO Entry
var updateDNEntry = function updateDNEntry(req, res, next) {
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  var connection = req.connection;
  var inputParam = (0, _extend2.default)({}, req.body);
  var complete = "Y";
  var partial_recived = new _nodeLinq.LINQ(inputParam.receipt_entry_detail).Where(function (w) {
    return w.outstanding_quantity != 0;
  }).ToArray();

  if (partial_recived.length > 0) {
    complete = "N";
  }

  (0, _logging.debugLog)("inputParam.dn_id: ", inputParam.dn_id);
  connection.query("UPDATE `hims_f_procurement_dn_header` SET `is_completed`=?, `completed_date`=?, `updated_by` = ?,`updated_date` = ? \
      WHERE `hims_f_procurement_dn_header_id`=?", [complete, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date(), inputParam.dn_id], function (error, result) {
    if (error) {
      (0, _utils.releaseDBConnection)(db, connection);
      next(error);
    }

    if (result != "" && result != null) {
      var details = inputParam.receipt_entry_detail;

      var qry = "";

      for (var i = 0; i < details.length; i++) {
        qry += " UPDATE `hims_f_procurement_dn_detail` SET quantity_outstanding='" + details[i].outstanding_quantity + "' WHERE hims_f_procurement_dn_detail_id='" + details[i].dn_detail_id + "';";
      }
      (0, _logging.debugLog)("qry: ", qry);

      if (qry != "") {
        connection.query(qry, function (error, detailResult) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          req.dnrecords = detailResult;

          next();
        });
      } else {
        (0, _utils.releaseDBConnection)(db, connection);
        req.records = {};
        next();
      }
    } else {
      connection.rollback(function () {
        (0, _utils.releaseDBConnection)(db, connection);
        req.records = {};
        next();
      });
    }
    // req.data = req.records.delivery_note_number;
    // next();
  });
};

module.exports = {
  addReceiptEntry: addReceiptEntry,
  getReceiptEntry: getReceiptEntry,
  updateReceiptEntry: updateReceiptEntry,
  updateDNEntry: updateDNEntry
};
//# sourceMappingURL=ReceiptEntry.js.map