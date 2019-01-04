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

var _nodeLinq = require("node-linq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by Nowshad: to Insert Requisition Entry
var addinventoryrequisitionEntry = function addinventoryrequisitionEntry(req, res, next) {
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
            module_desc: ["INV_REQ_NUM"],
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

          var today = (0, _moment2.default)().format("YYYY-MM-DD");
          (0, _logging.debugLog)("today:", today);

          connection.query("INSERT INTO `hims_f_inventory_material_header` (material_requisition_number,requistion_date,from_location_type,\
                from_location_id, expiration_date,required_date,requested_by,on_hold, to_location_id, \
                to_location_type, description, comment, is_completed, completed_date, completed_lines,requested_lines, \
                purchase_created_lines,status,requistion_type,no_of_transfers,no_of_po, authorize1,authorize1_date, \
                authorize1_by,authorie2,authorize2_date,authorize2_by,cancelled, cancelled_by,cancelled_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [documentCode, today, input.from_location_type, input.from_location_id, input.expiration_date, input.required_date, req.userIdentity.algaeh_d_app_user_id, input.on_hold, input.to_location_id, input.to_location_type, input.description, input.comment, input.is_completed, input.completed_date, input.completed_lines, input.requested_lines, input.purchase_created_lines, input.status, input.requistion_type, input.no_of_transfers, input.no_of_po, input.authorize1, input.authorize1_date, input.authorize1_by, input.authorie2, input.authorize2_date, input.authorize2_by, input.cancelled, input.cancelled_by, input.cancelled_date], function (error, headerResult) {
            (0, _logging.debugLog)("error: ", "Check");
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            (0, _logging.debugLog)(" pos header id :", headerResult);

            if (headerResult.insertId != null) {
              var insurtColumns = ["item_id", "item_category_id", "item_group_id", "item_uom", "to_qtyhand", "from_qtyhand", "quantity_required"];

              connection.query("INSERT INTO hims_f_inventory_material_detail(" + insurtColumns.join(",") + ",inventory_header_id) VALUES ?", [(0, _utils.jsonArrayToObject)({
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
                    material_requisition_number: documentCode
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
var getinventoryrequisitionEntry = function getinventoryrequisitionEntry(req, res, next) {
  var selectWhere = {
    material_requisition_number: "ALL",
    from_location_id: "ALL",
    to_location_id: "ALL",
    authorize1: "ALL",
    authorie2: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    (0, _logging.debugLog)("where", where);
    db.getConnection(function (error, connection) {
      connection.query("SELECT * from  hims_f_inventory_material_header\
          where " + where.condition, where.values, function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        if (headerResult.length != 0) {
          (0, _logging.debugLog)("hims_f_inventory_material_header_id: ", headerResult[0].hims_f_inventory_material_header_id);
          connection.query("select * from hims_f_inventory_material_detail where inventory_header_id=?", headerResult[0].hims_f_inventory_material_header_id, function (error, inventory_stock_detail) {
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

var updateinventoryrequisitionEntry = function updateinventoryrequisitionEntry(req, res, next) {
  // let RequisitionEntry = {
  //   posted: null,
  //   updated_by: req.userIdentity.algaeh_d_app_user_id
  // };
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

      connection.query("UPDATE `hims_f_inventory_material_header` SET `authorize1`=?, `authorize1_date`=?, `authorize1_by`=?, \
      `authorie2`=?, `authorize2_date`=?, `authorize2_by`=? \
      WHERE `hims_f_inventory_material_header_id`=?", [inputParam.authorize1, new Date(), inputParam.updated_by, inputParam.authorie2, new Date(), inputParam.updated_by, inputParam.hims_f_inventory_material_header_id], function (error, result) {
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
            qry += " UPDATE `hims_f_inventory_material_detail` SET inventory_header_id='" + details[i].inventory_header_id + "',completed='" + details[i].completed + "',item_category_id='" + details[i].item_category_id + "',item_group_id='" + details[i].item_group_id + "',item_id='" + details[i].item_id + "',quantity_required='" + details[i].quantity_required + "',quantity_authorized='" + details[i].quantity_authorized + "',item_uom='" + details[i].item_uom + "',quantity_recieved='" + (details[i].quantity_recieved || 0) + "',quantity_outstanding='" + (details[i].quantity_outstanding || 0) + "' WHERE hims_f_inventory_material_detail_id='" + details[i].hims_f_inventory_material_detail_id + "';";
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
};

//created by Nowshad: to get inventory Requisition Entry
var getinventoryAuthrequisitionList = function getinventoryAuthrequisitionList(req, res, next) {
  var selectWhere = {
    from_location_id: null,
    to_location_id: null,
    authorize1: null,
    authorie2: null
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var inputParam = (0, _extend2.default)(selectWhere, req.query);

    var strQuery = "SELECT * from  hims_f_inventory_material_header\
    where cancelled='N' ";

    if (inputParam.from_location_id !== null) {
      strQuery = strQuery + " and from_location_id = " + inputParam.from_location_id;
    }
    if (inputParam.to_location_id !== null) {
      strQuery = strQuery + " and to_location_id = " + inputParam.to_location_id;
    }
    if (inputParam.authorize1 !== null) {
      strQuery = strQuery + " and authorize1 = '" + inputParam.authorize1 + "'";
    }
    if (inputParam.authorie2 !== null) {
      strQuery = strQuery + " and authorie2 = '" + inputParam.authorie2 + "'";
    }

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
//created by Nowshad: to Update Requisition Entry
var updateinvreqEntryOnceTranfer = function updateinvreqEntryOnceTranfer(req, res, next) {
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  var connection = req.connection;
  var inputParam = (0, _extend2.default)({}, req.body);
  var complete = "Y";

  (0, _logging.debugLog)("updateinvreqEntryOnceTranfer: ", complete);
  var partial_recived = new _nodeLinq.LINQ(inputParam.inventory_stock_detail).Where(function (w) {
    return w.quantity_outstanding != 0;
  }).ToArray();

  if (partial_recived.length > 0) {
    complete = "N";
  }
  connection.query("UPDATE `hims_f_inventory_material_header` SET `is_completed`=?, `completed_date`=? \
      WHERE `hims_f_inventory_material_header_id`=?", [complete, new Date(), inputParam.hims_f_inventory_material_header_id], function (error, result) {
    if (error) {
      connection.rollback(function () {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      });
    }

    if (result != "" && result != null) {
      var details = inputParam.inventory_stock_detail;

      var qry = "";

      for (var i = 0; i < details.length; i++) {
        qry += " UPDATE `hims_f_inventory_material_detail` SET quantity_outstanding='" + details[i].quantity_outstanding + "' WHERE hims_f_inventory_material_detail_id='" + details[i].material_requisition_detail_id + "';";
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
    // releaseDBConnection(db, connection);
    // req.records = result;
    // next();
  });
};

module.exports = {
  addinventoryrequisitionEntry: addinventoryrequisitionEntry,
  getinventoryrequisitionEntry: getinventoryrequisitionEntry,
  updateinventoryrequisitionEntry: updateinventoryrequisitionEntry,
  getinventoryAuthrequisitionList: getinventoryAuthrequisitionList,
  updateinvreqEntryOnceTranfer: updateinvreqEntryOnceTranfer
};
//# sourceMappingURL=inventoryrequisitionEntry.js.map