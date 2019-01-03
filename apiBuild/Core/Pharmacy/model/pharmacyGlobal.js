"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to get Uom Location Stock
var getUomLocationStock = function getUomLocationStock(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let input = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hims_m_item_uom_id, item_master_id, uom_id, stocking_uom, conversion_factor, hims_m_item_uom.uom_status, \
        hims_d_pharmacy_uom.uom_description  \
        from hims_m_item_uom,hims_d_pharmacy_uom where hims_m_item_uom.record_status='A' and \
        hims_m_item_uom.uom_id = hims_d_pharmacy_uom.hims_d_pharmacy_uom_id and hims_m_item_uom.item_master_id=? ;\
        SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
        avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
        from hims_m_item_location where record_status='A'  and item_id=? and pharmacy_location_id=? and expirydt > CURDATE() \
        and qtyhand>0  order by expirydt", [req.query.item_id, req.query.item_id, req.query.location_id], function (error, result) {
        (0, _logging.debugLog)("uomResult", result);
        (0, _utils.releaseDBConnection)(db, connection);

        if (error) {
          next(error);
        }
        req.records = {
          uomResult: result[0],
          locationResult: result[1]
        };
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: getVisitPrescriptionDetails
var getVisitPrescriptionDetails = function getVisitPrescriptionDetails(req, res, next) {
  var selectWhere = {
    episode_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT H.hims_f_prescription_id,H.patient_id, H.encounter_id, H.provider_id, H.episode_id, \
          H.prescription_date,H.prescription_status,H.cancelled,D.hims_f_prescription_detail_id, D.prescription_id, D.item_id, D.generic_id, D.dosage,\
          D.frequency, D.no_of_days,D.dispense, D.frequency_type, D.frequency_time, D.start_date, D.item_status, D.service_id, D.uom_id,\
          D.item_category_id, D.item_group_id\
          from hims_f_prescription H,hims_f_prescription_detail D  WHERE H.hims_f_prescription_id = D.prescription_id and " + where.condition, where.values, function (error, result) {
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

//created by Nowshad: get Item Moment
var getItemMoment = function getItemMoment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var whereOrder = "";
    if (req.query.from_date != undefined) {
      whereOrder = "date(transaction_date) between date('" + req.query.from_date + "') AND date('" + req.query.to_date + "')";
    } else {
      whereOrder = "date(transaction_date) <= date(now())";
    }
    delete req.query.from_date;
    delete req.query.to_date;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(req.query));

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT * from hims_f_pharmacy_trans_history  WHERE record_status = 'A' and " + whereOrder + (where.condition == "" ? "" : " AND " + where.condition), where.values, function (error, result) {
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

//created by irfan: to get Uom Location Stock
var getItemLocationStock = function getItemLocationStock(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let Orderby = "order by expirydt";
    // let input = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
        avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
        from hims_m_item_location where record_status='A'  and item_id=? and pharmacy_location_id=? \
        and qtyhand>0  order by expirydt", [req.query.item_id, req.query.location_id], function (error, result) {
        (0, _logging.debugLog)("uomResult", result);
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

//created by Nowshad: to get User Wise Location Permission
var getUserLocationPermission = function getUserLocationPermission(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let input = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("SELECT hims_m_location_permission_id,user_id, location_id,L.hims_d_pharmacy_location_id,L.location_description,\
        L.location_type,L.allow_pos from hims_m_location_permission LP,hims_d_pharmacy_location L \
        where LP.record_status='A' and\
         L.record_status='A' and LP.location_id=L.hims_d_pharmacy_location_id  and allow='Y' and user_id=?", [req.userIdentity.algaeh_d_app_user_id], function (error, result) {
        if (error) {
          next(error);
          (0, _utils.releaseDBConnection)(db, connection);
        }

        if (result.length < 1) {
          connection.query("select  hims_d_pharmacy_location_id, location_description, location_status, location_type,\
            allow_pos from hims_d_pharmacy_location where record_status='A'", function (error, resultLoctaion) {
            (0, _utils.releaseDBConnection)(db, connection);
            if (error) {
              next(error);
            }
            //ppppppppp
            req.records = resultLoctaion;
            next();
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = result;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get Items in selected Location
var getItemandLocationStock = function getItemandLocationStock(req, res, next) {
  var selectWhere = {
    item_id: "ALL",
    pharmacy_location_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
    var Orderby = " order by expirydt";
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT hims_m_item_location_id, item_id, pharmacy_location_id, item_location_status, batchno, expirydt, barcode, qtyhand, qtypo, cost_uom,\
        avgcost, last_purchase_cost, item_type, grn_id, grnno, sale_price, mrp_price, sales_uom \
        from hims_m_item_location where record_status='A' and qtyhand>0 and " + where.condition, where.values, function (error, result) {
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

//created by:irfan, Patient-receipt if advance or  Refund to patient
var pharmacyReceiptInsert = function pharmacyReceiptInsert(req, res, next) {
  var P_receiptHeaderModel = {
    hims_f_receipt_header_id: null,
    receipt_number: null,
    receipt_date: null,
    billing_header_id: null,
    total_amount: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    record_status: null,
    counter_id: null,
    shift_id: null,
    pay_type: null
  };

  (0, _logging.debugFunction)("Receipt POS and Sales");

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

      var inputParam = (0, _extend2.default)(P_receiptHeaderModel, req.body);

      // fuction for advance recieved from patient
      if (inputParam.pay_type == "R") {
        (0, _utils.runningNumber)(req.db, 5, "PAT_RCPT", function (error, numgenId, newNumber) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          req.query.receipt_number = newNumber;
          req.body.receipt_number = newNumber;
          inputParam.receipt_number = newNumber;
          (0, _logging.debugLog)("new R for recpt number:", newNumber);
          // receipt header table insert
          connection.query("INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
              created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
              ,?,?,?,?,?,?,?,?)", [inputParam.receipt_number, new Date(), inputParam.billing_header_id, inputParam.total_amount, inputParam.created_by, new Date(), inputParam.updated_by, new Date(), inputParam.counter_id, inputParam.shift_id, inputParam.pay_type], function (error, headerRcptResult) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            (0, _logging.debugFunction)("inside header result");
            if (headerRcptResult.insertId != null && headerRcptResult.insertId != "") {
              var receptSample = ["card_check_number", "expiry_date", "pay_type", "amount", "created_by", "updated_by", "card_type"];

              connection.query("INSERT  INTO hims_f_receipt_details ( " + receptSample.join(",") + ",hims_f_receipt_header_id) VALUES ? ", [(0, _utils.jsonArrayToObject)({
                sampleInputObject: receptSample,
                arrayObj: inputParam.receiptdetails,
                req: req,
                newFieldToInsert: [headerRcptResult.insertId]
              })], function (error, RcptDetailsRecords) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _logging.debugFunction)("inside details result");
                req.records = {
                  receipt_header_id: headerRcptResult.insertId,
                  receipt_number: inputParam.receipt_number
                };
                (0, _utils.releaseDBConnection)(db, connection);
                next();

                (0, _logging.debugLog)("Records: ", req.records);
              });
            } else {
              (0, _logging.debugLog)("Data is not inerted to billing header");
              (0, _utils.releaseDBConnection)(db, connection);
              connection.rollback(function () {
                next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while Sale Retun"));
              });
            }
          });
        });
      }

      //function for payment to the patient
      if (inputParam.pay_type == "P") {
        (0, _utils.runningNumber)(req.db, 7, "PYMNT_NO", function (error, numgenId, newNumber) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          (0, _logging.debugLog)("new PAYMENT no : ", newNumber);
          inputParam.receipt_number = newNumber;
          req.body.receipt_number = newNumber;

          //R-->recieved amount   P-->payback amount

          // receipt header table insert
          connection.query("INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
                created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
                ,?,?,?,?,?,?,?,?)", [inputParam.receipt_number, new Date(), inputParam.billing_header_id, inputParam.total_amount, inputParam.created_by, new Date(), inputParam.updated_by, new Date(), inputParam.counter_id, inputParam.shift_id, inputParam.pay_type], function (error, headerRcptResult) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            (0, _logging.debugFunction)("inside header result");
            (0, _logging.debugLog)("Insert : ", inputParam.receiptdetails);
            if (headerRcptResult.insertId != null && headerRcptResult.insertId != "") {
              // receipt details table insert
              var receptSample = ["card_check_number", "expiry_date", "pay_type", "amount", "created_by", "updated_by", "card_type"];
              connection.query("INSERT  INTO hims_f_receipt_details ( " + receptSample.join(",") + ",hims_f_receipt_header_id) VALUES ? ", [(0, _utils.jsonArrayToObject)({
                sampleInputObject: receptSample,
                arrayObj: inputParam.receiptdetails,
                req: req,
                newFieldToInsert: [headerRcptResult.insertId]
              })], function (error, RcptDetailsRecords) {
                (0, _logging.debugLog)("Error : ", error);
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _logging.debugFunction)("inside details result");
                req.records = {
                  receipt_header_id: headerRcptResult.insertId,
                  receipt_number: inputParam.receipt_number
                };
                (0, _utils.releaseDBConnection)(db, connection);
                next();

                (0, _logging.debugLog)("Records: ", req.records);
                // if (error) {
                //   debugLog("Error : ", error);
                //   connection.rollback(() => {
                //     releaseDBConnection(db, connection);
                //     next(error);
                //   });
                //   req.records = {
                //     receipt_header_id: headerRcptResult.insertId,
                //     receipt_number: inputParam.receipt_number
                //   };
                //   releaseDBConnection(db, connection);
                //   next();
                //   debugLog("Records: ", req.records);
                // }
              });
            } else {
              (0, _logging.debugLog)("Data is not inerted to billing header");
              (0, _utils.releaseDBConnection)(db, connection);
              connection.rollback(function () {
                next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while Sale Retun"));
              });
            }
          });
        }); //end of runing number PYMNT
      }
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getUomLocationStock: getUomLocationStock,
  getVisitPrescriptionDetails: getVisitPrescriptionDetails,
  getItemMoment: getItemMoment,
  getItemLocationStock: getItemLocationStock,
  getUserLocationPermission: getUserLocationPermission,
  getItemandLocationStock: getItemandLocationStock,
  pharmacyReceiptInsert: pharmacyReceiptInsert
};
//# sourceMappingURL=pharmacyGlobal.js.map