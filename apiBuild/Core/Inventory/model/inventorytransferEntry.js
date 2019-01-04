"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import { getBillDetailsFunctionality } from "../../model/billing";


var _utils = require("../../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _commonFunction = require("./commonFunction");

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by Nowshad: to Insert Requisition Entry
var addtransferEntry = function addtransferEntry(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    (0, _logging.debugLog)("Requisition: ", "add Requisition");
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

        var requestCounter = 1;

        return new _bluebird2.default(function (resolve, reject) {
          (0, _utils.runningNumberGen)({
            db: connection,
            counter: requestCounter,
            module_desc: ["INV_TRN_NUM"],
            onFailure: function onFailure(error) {
              reject(error);
            },
            onSuccess: function onSuccess(result) {
              resolve(result);
            }
          });
        }).then(function (result) {
          var documentCode = result[0].completeNumber;
          //   debugLog("connection", JSON.stringify(connection));
          (0, _logging.debugLog)("documentCode:", documentCode);

          var year = (0, _moment2.default)().format("YYYY");
          (0, _logging.debugLog)("onlyyear:", year);

          var today = (0, _moment2.default)().format("YYYY-MM-DD");
          (0, _logging.debugLog)("today:", today);

          var month = (0, _moment2.default)().format("MM");
          (0, _logging.debugLog)("month:", month);
          var period = month;

          connection.query("INSERT INTO `hims_f_inventory_transfer_header` (transfer_number,transfer_date,`year`,period,\
                hims_f_inventory_material_header_id,from_location_type,from_location_id, material_requisition_number, to_location_id, \
                to_location_type, description, completed, completed_date, completed_lines, \
                transfer_quantity,requested_quantity,recieved_quantity,outstanding_quantity, \
                cancelled, cancelled_by,cancelled_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [documentCode, today, year, period, input.hims_f_inventory_material_header_id, input.from_location_type, input.from_location_id, input.material_requisition_number, input.to_location_id, input.to_location_type, input.description, input.completed, input.completed_date, input.completed_lines, input.transfer_quantity, input.requested_quantity, input.recieved_quantity, input.outstanding_quantity, input.cancelled, input.cancelled_by, input.cancelled_date], function (error, headerResult) {
            (0, _logging.debugLog)("error: ", "Check");
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            (0, _logging.debugLog)(" pos header id :", headerResult);

            if (headerResult.insertId != null) {
              var insurtColumns = ["item_id", "item_category_id", "item_group_id", "batchno", "expiry_date", "to_qtyhand", "from_qtyhand", "quantity_requested", "quantity_authorized", "uom_requested_id", "quantity_transferred", "uom_transferred_id", "quantity_recieved", "uom_recieved_id", "quantity_outstanding", "transfer_to_date", "grnno", "unit_cost", "sales_uom", "material_requisition_header_id", "material_requisition_detail_id"];

              connection.query("INSERT INTO hims_f_inventory_transfer_detail(" + insurtColumns.join(",") + ",transfer_header_id) VALUES ?", [(0, _utils.jsonArrayToObject)({
                sampleInputObject: insurtColumns,
                arrayObj: req.body.inventory_stock_detail,
                newFieldToInsert: [headerResult.insertId],
                req: req
              })], function (error, detailResult) {
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
                  req.records = {
                    transfer_number: documentCode,
                    hims_f_inventory_transfer_header_id: headerResult.insertId,
                    year: year,
                    period: period
                  };
                  next();
                });
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
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get inventory Requisition Entry
var gettransferEntry = function gettransferEntry(req, res, next) {
  var selectWhere = {
    transfer_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("SELECT * from  hims_f_inventory_transfer_header\
          where " + where.condition, where.values, function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        if (headerResult.length != 0) {
          (0, _logging.debugLog)("hims_f_inventory_transfer_header_id: ", headerResult[0].hims_f_inventory_transfer_header_id);
          connection.query("select * from hims_f_inventory_transfer_detail where transfer_header_id=?", headerResult[0].hims_f_inventory_transfer_header_id, function (error, inventory_stock_detail) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = _extends({}, headerResult[0], { inventory_stock_detail: inventory_stock_detail });
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

//created by Nowshad: to Post Requisition Entry
var updatetransferEntry = function updatetransferEntry(req, res, next) {
  var TransferEntry = {
    completed: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var connection = req.connection;

    connection.beginTransaction(function (error) {
      if (error) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      }
      return new _bluebird2.default(function (resolve, reject) {
        var inputParam = (0, _extend2.default)(TransferEntry, req.body);

        (0, _logging.debugLog)("completed", inputParam.completed);
        (0, _logging.debugLog)("inventory_stock_detail", req.body.inventory_stock_detail);
        connection.query("UPDATE `hims_f_inventory_transfer_header` SET `completed`=?, `completed_date`=? \
          WHERE `hims_f_inventory_transfer_header_id`=?", [inputParam.completed, new Date(), inputParam.hims_f_inventory_transfer_header_id], function (error, result) {
          (0, _logging.debugLog)("error", error);
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }).then(function (output) {
        return new _bluebird2.default(function (resolve, reject) {
          (0, _logging.debugLog)("output", output);
          req.options = {
            db: connection,
            onFailure: function onFailure(error) {
              reject(error);
            },
            onSuccess: function onSuccess(result) {
              resolve(result);
            }
          };
          //Update From Location
          (0, _logging.debugLog)("From", "Data");
          (0, _commonFunction.updateIntoInvItemLocation)(req, res, next);
        });
      }).then(function (output) {
        return new _bluebird2.default(function (resolve, reject) {
          (0, _logging.debugLog)("output", output);
          req.options = {
            db: connection,
            onFailure: function onFailure(error) {
              reject(error);
            },
            onSuccess: function onSuccess(result) {
              resolve(result);
            }
          };
          //Update To location
          for (var i = 0; i < req.body.inventory_stock_detail.length; i++) {
            req.body.inventory_stock_detail[i].location_id = req.body.to_location_id;
            req.body.inventory_stock_detail[i].location_type = req.body.to_location_type;

            req.body.inventory_stock_detail[i].sales_uom = req.body.inventory_stock_detail[i].uom_transferred_id;

            delete req.body.inventory_stock_detail[i].operation;
            req.body.inventory_stock_detail[i].operation = "+";
          }

          (0, _logging.debugLog)("To ", "Data");
          (0, _commonFunction.updateIntoInvItemLocation)(req, res, next);
        }).then(function (records) {
          connection.commit(function (error) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = records;
            (0, _utils.releaseDBConnection)(db, connection);
            next();
          });
        }).catch(function (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        });
      }).catch(function (error) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get inventory Requisition Entry to transfer
var getrequisitionEntryTransfer = function getrequisitionEntryTransfer(req, res, next) {
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
          connection.query("select * from hims_f_inventory_material_detail p left outer join hims_m_inventory_item_location l \
                on l.item_id =p.item_id where inventory_header_id=? and l.record_status='A'and l.inventory_location_id=? \
                and l.expirydt > now() and l.qtyhand>0  order by l.expirydt asc limit 0,1", [headerResult[0].hims_f_inventory_material_header_id, headerResult[0].to_location_id], function (error, inventory_stock_detail) {
            (0, _logging.debugLog)("inventory_stock_detail: ", inventory_stock_detail);
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = _extends({}, headerResult[0], { inventory_stock_detail: inventory_stock_detail });
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

module.exports = {
  addtransferEntry: addtransferEntry,
  gettransferEntry: gettransferEntry,
  updatetransferEntry: updatetransferEntry,
  getrequisitionEntryTransfer: getrequisitionEntryTransfer
};
//# sourceMappingURL=inventorytransferEntry.js.map