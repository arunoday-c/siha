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

var _commonFunction = require("./commonFunction");

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to pharmacy_intial_stock
var addPharmacyInitialStock = function addPharmacyInitialStock(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    (0, _logging.debugLog)("inside", "add stock");
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
            module_desc: ["STK_DOC"],
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

          var year = (0, _moment2.default)().format("YYYY");
          (0, _logging.debugLog)("onlyyear:", year);

          var today = (0, _moment2.default)().format("YYYY-MM-DD");
          (0, _logging.debugLog)("today:", today);

          var month = (0, _moment2.default)().format("MM");
          (0, _logging.debugLog)("month:", month);
          var period = month;

          (0, _logging.debugLog)("period:", period);
          connection.query("INSERT INTO `hims_f_pharmacy_stock_header` (document_number,docdate,`year`,period,description,posted,created_date,created_by,updated_date,updated_by) \
            VALUE(?,?,?,?,?,?,?,?,?,?)", [documentCode, today, year, period, input.description, input.posted, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date(), req.userIdentity.algaeh_d_app_user_id], function (error, headerResult) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            (0, _logging.debugLog)(" stock header id :", headerResult.insertId);

            if (headerResult.insertId != null) {
              var insurtColumns = ["item_id", "location_type", "location_id", "item_category_id", "item_group_id", "uom_id", "barcode", "batchno", "sales_uom", "expiry_date", "grn_number", "quantity", "conversion_fact", "unit_cost", "extended_cost", "comment", "created_by", "updated_by"];

              connection.query("INSERT INTO hims_f_pharmacy_stock_detail(" + insurtColumns.join(",") + ",pharmacy_stock_header_id,created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
                sampleInputObject: insurtColumns,
                arrayObj: req.body.pharmacy_stock_detail,
                newFieldToInsert: [headerResult.insertId, new Date(), new Date()],
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
                    document_number: documentCode,
                    hims_f_pharmacy_stock_header_id: headerResult.insertId,
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

//created by irfan: to get PharmacyInitialStock
var getPharmacyInitialStock = function getPharmacyInitialStock(req, res, next) {
  var selectWhere = {
    document_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("SELECT hims_f_pharmacy_stock_header_id, document_number, docdate, year,\
          period, description, posted  from  hims_f_pharmacy_stock_header\
          where record_status='A' AND " + where.condition, where.values, function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)("result: ", headerResult);
        if (headerResult.length != 0) {
          (0, _logging.debugLog)("hims_f_pharmacy_stock_header_id: ", headerResult[0].hims_f_pharmacy_stock_header_id);
          connection.query("select * from hims_f_pharmacy_stock_detail where pharmacy_stock_header_id=? and record_status='A'", headerResult[0].hims_f_pharmacy_stock_header_id, function (error, pharmacy_stock_detail) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            req.records = _extends({}, headerResult[0], { pharmacy_stock_detail: pharmacy_stock_detail });
            (0, _utils.releaseDBConnection)(db, connection);
            next();
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = headerResult;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

var updatePharmacyInitialStock = function updatePharmacyInitialStock(req, res, next) {
  var initialStock = {
    posted: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

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
        return new _bluebird2.default(function (resolve, reject) {
          var inputParam = (0, _extend2.default)(initialStock, req.body);

          (0, _logging.debugLog)("posted", inputParam.posted);
          (0, _logging.debugLog)("pharmacy_stock_detail", req.body.pharmacy_stock_detail);
          connection.query("UPDATE `hims_f_pharmacy_stock_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `hims_f_pharmacy_stock_header_id`=?", [inputParam.posted, inputParam.updated_by, new Date(), inputParam.hims_f_pharmacy_stock_header_id], function (error, result) {
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

            (0, _commonFunction.updateIntoItemLocation)(req, res, next);
          })
          // .then(itemoutput => {
          //   return new Promise((resolve, reject) => {
          //     req.options = {
          //       db: connection,
          //       onFailure: error => {
          //         reject(error);
          //       },
          //       onSuccess: result => {
          //         resolve(result);
          //       }
          //     };
          //     debugLog("insertItemHistory", "insertItemHistory");
          //     insertItemHistory(req, res, next);
          //   })
          //Data
          // })
          .then(function (records) {
            connection.commit(function (error) {
              if (error) {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              }
              (0, _utils.releaseDBConnection)(db, connection);
              req.records = records;
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
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPharmacyInitialStock: addPharmacyInitialStock,
  getPharmacyInitialStock: getPharmacyInitialStock,
  updatePharmacyInitialStock: updatePharmacyInitialStock
};
//# sourceMappingURL=initialstock.js.map