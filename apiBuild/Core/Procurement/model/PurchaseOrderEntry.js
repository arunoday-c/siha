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

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by Nowshad: to save Purchase Order Entry
var addPurchaseOrderEntry = function addPurchaseOrderEntry(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    (0, _logging.debugLog)("PurchaseOrderEntry: ", "Purchase Order Entry");
    var connection = req.connection;

    var requestCounter = 1;

    connection.beginTransaction(function (error) {
      if (error) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      }
      return new _bluebird2.default(function (resolve, reject) {
        (0, _utils.runningNumberGen)({
          db: connection,
          counter: requestCounter,
          module_desc: ["PO_NUM"],
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

        connection.query("INSERT INTO `hims_f_procurement_po_header` (purchase_number,po_date,po_type,po_from, pharmcy_location_id,\
              inventory_location_id,location_type,vendor_id,expected_date,on_hold, phar_requisition_id,inv_requisition_id, \
              from_multiple_requisition, payment_terms, comment, sub_total, detail_discount, extended_total,sheet_level_discount_percent, \
              sheet_level_discount_amount,description,net_total,total_tax, net_payable,created_by,created_date, \
              updated_by,updated_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [documentCode, today, input.po_type, input.po_from, input.pharmcy_location_id, input.inventory_location_id, input.location_type, input.vendor_id, input.expected_date, input.on_hold, input.requisition_id, input.inv_requisition_id, input.from_multiple_requisition, input.payment_terms, input.comment, input.sub_total, input.detail_discount, input.extended_total, input.sheet_level_discount_percent, input.sheet_level_discount_amount, input.description, input.net_total, input.total_tax, input.net_payable, req.userIdentity.algaeh_d_app_user_id, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date()], function (error, headerResult) {
          (0, _logging.debugLog)("Success: ", "Check");
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          (0, _logging.debugLog)(" pos header id :", headerResult);

          if (headerResult.insertId != null) {
            var insurtColumns = ["phar_item_category", "phar_item_group", "phar_item_id", "inv_item_category_id", "inv_item_group_id", "inv_item_id", "order_quantity", "total_quantity", "pharmacy_uom_id", "inventory_uom_id", "unit_price", "extended_price", "sub_discount_percentage", "sub_discount_amount", "extended_cost", "net_extended_cost", "unit_cost", "expected_arrival_date", "pharmacy_requisition_id", "inventory_requisition_id", "tax_percentage", "tax_amount", "total_amount", "item_type"];

            connection.query("INSERT INTO hims_f_procurement_po_detail(" + insurtColumns.join(",") + ",procurement_header_id) VALUES ?", [(0, _utils.jsonArrayToObject)({
              sampleInputObject: insurtColumns,
              arrayObj: req.body.po_entry_detail,
              newFieldToInsert: [headerResult.insertId],
              req: req
            })], function (error, detailResult) {
              if (error) {
                (0, _logging.debugLog)("error: ", "Check");
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              req.records = {
                purchase_number: documentCode
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
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get PurchaseOrderEntry
var getPurchaseOrderEntry = function getPurchaseOrderEntry(req, res, next) {
  var selectWhere = {
    purchase_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    (0, _logging.debugLog)("where", where);
    db.getConnection(function (error, connection) {
      connection.query("SELECT * from  hims_f_procurement_po_header\
          where " + where.condition, where.values, function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        if (headerResult.length != 0) {
          (0, _logging.debugLog)("hims_f_procurement_po_header_id: ", headerResult[0].hims_f_procurement_po_header_id);
          connection.query("select * from hims_f_procurement_po_detail where procurement_header_id=?", headerResult[0].hims_f_procurement_po_header_id, function (error, po_entry_detail) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = _extends({}, headerResult[0], { po_entry_detail: po_entry_detail });
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

var updatePurchaseOrderEntry = function updatePurchaseOrderEntry(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        var inputParam = (0, _extend2.default)({}, req.body);
        (0, _logging.debugLog)("req.body: ", req.body);

        connection.query("UPDATE `hims_f_procurement_po_header` SET `authorize1`=?, `authorize_by_date`=?, `authorize_by_1`=? \
      WHERE `hims_f_procurement_po_header_id`=?", [inputParam.authorize1, new Date(), req.userIdentity.algaeh_d_app_user_id, inputParam.hims_f_procurement_po_header_id], function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          if (result !== "" && result != null) {
            var details = inputParam.po_entry_detail;

            var qry = "";

            for (var i = 0; i < details.length; i++) {
              qry += " UPDATE `hims_f_procurement_po_detail` SET authorize_quantity='" + details[i].authorize_quantity + "',rejected_quantity='" + details[i].rejected_quantity + "',quantity_recieved='" + (details[i].quantity_recieved || 0) + "',quantity_outstanding='" + (details[i].quantity_outstanding || 0) + "' WHERE hims_f_procurement_po_detail_id='" + details[i].hims_f_procurement_po_detail_id + "';";
            }

            if (qry != "") {
              connection.query(qry, function (error, detailResult) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }

                connection.commit(function (error) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }
                  (0, _utils.releaseDBConnection)(db, connection);
                  req.records = detailResult;
                  next();
                });
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
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get Pharmacy Requisition Entry to PO
var getPharRequisitionEntryPO = function getPharRequisitionEntryPO(req, res, next) {
  var selectWhere = {
    material_requisition_number: "ALL"
  };
  var RequisitionEntry = {
    material_requisition_number: null,
    from_location_id: null
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let where = whereCondition(extend(selectWhere, req.query));
    var inputParam = (0, _extend2.default)(RequisitionEntry, req.query);

    (0, _logging.debugLog)("inputParam: ", inputParam);
    db.getConnection(function (error, connection) {
      connection.query("SELECT * from  hims_f_pharamcy_material_header \
            where material_requisition_number=?", [inputParam.material_requisition_number], function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        if (headerResult.length != 0) {
          (0, _logging.debugLog)("hims_f_pharamcy_material_header_id: ", headerResult[0].hims_f_pharamcy_material_header_id);
          (0, _logging.debugLog)("from_location_id: ", inputParam.from_location_id);

          (0, _logging.debugLog)("to_location_id: ", headerResult[0].to_location_id);
          connection.query("select * from hims_f_pharmacy_material_detail p left outer join hims_d_item_master l \
                on l.hims_d_item_master_id =p.item_id where pharmacy_header_id=?", [headerResult[0].hims_f_pharamcy_material_header_id], function (error, po_entry_detail) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = _extends({}, headerResult[0], { po_entry_detail: po_entry_detail });
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

//created by Nowshad: to get Inventory Requisition Entry to PO
var getInvRequisitionEntryPO = function getInvRequisitionEntryPO(req, res, next) {
  var selectWhere = {
    material_requisition_number: "ALL"
  };
  var RequisitionEntry = {
    material_requisition_number: null,
    from_location_id: null
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let where = whereCondition(extend(selectWhere, req.query));
    var inputParam = (0, _extend2.default)(RequisitionEntry, req.query);

    (0, _logging.debugLog)("inputParam: ", inputParam);
    db.getConnection(function (error, connection) {
      connection.query("SELECT * from  hims_f_inventory_material_header \
            where material_requisition_number=?", [inputParam.material_requisition_number], function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        if (headerResult.length != 0) {
          (0, _logging.debugLog)("hims_f_inventory_material_header_id: ", headerResult[0].hims_f_inventory_material_header_id);
          (0, _logging.debugLog)("from_location_id: ", inputParam.from_location_id);

          (0, _logging.debugLog)("to_location_id: ", headerResult[0].to_location_id);
          connection.query("select * from hims_f_inventory_material_detail p left outer join hims_d_item_master l \
                on l.hims_d_item_master_id =p.item_id where inventory_header_id=?", [headerResult[0].hims_f_inventory_material_header_id], function (error, po_entry_detail) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = _extends({}, headerResult[0], { po_entry_detail: po_entry_detail });
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

//created by Nowshad: to get Pharmacy Requisition Entry
var getAuthPurchaseList = function getAuthPurchaseList(req, res, next) {
  var selectWhere = {
    pharmcy_location_id: null,
    inventory_location_id: null
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var inputParam = (0, _extend2.default)(selectWhere, req.query);

    var strQuery = "SELECT * from  hims_f_procurement_po_header\
    where cancelled='N' ";

    if (inputParam.pharmcy_location_id !== null) {
      strQuery = strQuery + " and pharmcy_location_id = " + inputParam.pharmcy_location_id;
    }
    if (inputParam.inventory_location_id !== null) {
      strQuery = strQuery + " and inventory_location_id = " + inputParam.inventory_location_id;
    }
    // if (inputParam.authorize1 !== null) {
    //   strQuery = strQuery + " and authorize1 = '" + inputParam.authorize1 + "'";
    // }
    // if (inputParam.authorie2 !== null) {
    //   strQuery = strQuery + " and authorie2 = '" + inputParam.authorie2 + "'";
    // }

    (0, _logging.debugLog)("strQuery", strQuery);
    db.getConnection(function (error, connection) {
      connection.query(strQuery, function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        req.records = headerResult;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Update Pharmacy Requisition Entry
var updatePharReqEntry = function updatePharReqEntry(req, res, next) {
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  var connection = req.connection;
  var inputParam = (0, _extend2.default)({}, req.body);

  connection.query("UPDATE `hims_f_pharamcy_material_header` SET `is_completed`=?, `completed_date`=? \
      WHERE `hims_f_pharamcy_material_header_id`=?", ["Y", new Date(), inputParam.phar_requisition_id], function (error, result) {
    if (error) {
      connection.rollback(function () {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      });
    }
    if (result !== "" && result != null) {
      var details = inputParam.pharmacy_stock_detail;

      var qry = "";

      for (var i = 0; i < details.length; i++) {
        (0, _logging.debugLog)("Data:n ", details[i].pharmacy_requisition_id);
        qry += " UPDATE `hims_f_pharmacy_material_detail` SET po_created_date=now()" + ",po_created='" + "Y" + "',po_created_quantity='" + details[i].total_quantity + "' WHERE hims_f_pharmacy_material_detail_id='" + details[i].pharmacy_requisition_id + "';";
      }

      if (qry != "") {
        connection.query(qry, function (error, detailResult) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          req.data = req.records.purchase_number;
          next();
          // connection.commit(error => {
          //   if (error) {
          //     connection.rollback(() => {
          //       releaseDBConnection(db, connection);
          //       next(error);
          //     });
          //   }
          //   releaseDBConnection(db, connection);
          //   req.records = req.records.purchase_number;
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
};

//created by Nowshad: to Update Inventory Requisition Entry
var updateInvReqEntry = function updateInvReqEntry(req, res, next) {
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  var connection = req.connection;
  var inputParam = (0, _extend2.default)({}, req.body);

  connection.query("UPDATE `hims_f_inventory_material_header` SET `is_completed`=?, `completed_date`=? \
      WHERE `hims_f_inventory_material_header_id`=?", ["Y", new Date(), inputParam.inv_requisition_id], function (error, result) {
    if (error) {
      connection.rollback(function () {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      });
    }
    if (result !== "" && result != null) {
      var details = inputParam.inventory_stock_detail;

      var qry = "";

      for (var i = 0; i < details.length; i++) {
        qry += " UPDATE `hims_f_inventory_material_detail` SET po_created_date=now()" + ",po_created='" + "Y" + "',po_created_quantity='" + details[i].total_quantity + "' WHERE hims_f_inventory_material_detail_id='" + details[i].inventory_requisition_id + "';";
      }

      if (qry != "") {
        connection.query(qry, function (error, detailResult) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          req.data = req.records.purchase_number;
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
};

module.exports = {
  addPurchaseOrderEntry: addPurchaseOrderEntry,
  getPurchaseOrderEntry: getPurchaseOrderEntry,
  updatePurchaseOrderEntry: updatePurchaseOrderEntry,
  getAuthPurchaseList: getAuthPurchaseList,
  getInvRequisitionEntryPO: getInvRequisitionEntryPO,
  getPharRequisitionEntryPO: getPharRequisitionEntryPO,
  updatePharReqEntry: updatePharReqEntry,
  updateInvReqEntry: updateInvReqEntry
};
//# sourceMappingURL=PurchaseOrderEntry.js.map