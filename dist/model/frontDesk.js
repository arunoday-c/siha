"use strict";

var _patientRegistration = require("../model/patientRegistration");

var _visit = require("../model/visit");

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _billing = require("../model/billing");

var _insurance = require("../model/insurance");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nodeLinq = require("node-linq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestCounter = 0;
//created by irfan :to save front desk data inputs
var addFrontDesk = function addFrontDesk(req, res, next) {
  (0, _logging.debugFunction)("addFrontDesk");

  requestCounter = requestCounter + 1;
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    if (req.query["data"] != null) {
      req.query = JSON.parse(req.query["data"]);
      req.body = req.query;
    }

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
          (0, _utils.runningNumberGen)({
            db: connection,
            counter: requestCounter,
            module_desc: ["PAT_REGS", "PAT_VISIT", "PAT_BILL", "RECEIPT"],
            onFailure: function onFailure(error) {
              reject(error);
            },
            onSuccess: function onSuccess(result) {
              resolve(result);
            }
          });
        }).then(function (output) {
          //Calling Patient Registration function
          var patients = new _nodeLinq.LINQ(output).Where(function (w) {
            return w.module_desc == "PAT_REGS";
          }).FirstOrDefault();

          req.query.patient_code = patients.completeNumber;
          req.body.patient_code = patients.completeNumber;
          return new _bluebird2.default(function (resolve, reject) {
            req.options = {
              db: connection,
              onFailure: function onFailure(error) {
                reject(error);
              },
              onSuccess: function onSuccess(result) {
                resolve(result);
              }
            };
            (0, _patientRegistration.insertPatientData)(req, res, next);
          }).then(function (patientInsertedRecord) {
            //Get  new visit running number.
            var visit = new _nodeLinq.LINQ(output).Where(function (w) {
              return w.module_desc == "PAT_VISIT";
            }).FirstOrDefault();
            (0, _logging.debugLog)("patientInsertedRecord ", patientInsertedRecord);

            req.query.visit_code = visit.completeNumber;
            req.body.visit_code = visit.completeNumber;
            delete req["options"]["onFailure"];
            delete req["options"]["onSuccess"];
            //Visit Promise
            return new _bluebird2.default(function (resolve, reject) {
              (0, _logging.debugLog)("Inside Visit");
              req.options.onFailure = function (error) {
                reject(error);
              };
              req.options.onSuccess = function (result) {
                resolve(result);
              };
              // Calling Visit
              (0, _visit.insertPatientVisitData)(req, res, next);
            }).then(function (visitData) {
              req.query.visit_id = visitData["insertId"];
              req.visit_id = visitData["insertId"];
              req.body.visit_id = visitData["insertId"];
              req.body.patient_visit_id = visitData["insertId"];
              (0, _logging.debugLog)("Gen Visit ", visitData);
              //Insurance Promise
              return new _bluebird2.default(function (resolve, reject) {
                (0, _logging.debugLog)("Inside Insurance");
                if (req.body.insured == "Y") {
                  delete req["options"]["onFailure"];
                  delete req["options"]["onSuccess"];
                  req.options.onFailure = function (error) {
                    reject(error);
                  };
                  req.options.onSuccess = function (data) {
                    resolve(data);
                  };
                  //Check for insurace
                  (0, _insurance.addPatientInsuranceData)(req, res, next);
                } else {
                  resolve({});
                }
              }).then(function (insuredRecords) {
                (0, _logging.debugLog)("Orver all records number gen", output);
                var bill = new _nodeLinq.LINQ(output).Where(function (w) {
                  return w.module_desc == "PAT_BILL";
                }).FirstOrDefault();
                req.bill_number = bill.completeNumber;
                req.body.bill_number = bill.completeNumber;
                //Bill generation
                return new _bluebird2.default(function (resolve, reject) {
                  (0, _logging.debugLog)("Inside Billing");
                  delete req["options"]["onFailure"];
                  delete req["options"]["onSuccess"];
                  req.options.onFailure = function (error) {
                    reject(error);
                  };
                  req.options.onSuccess = function (data) {
                    resolve(data);
                  };

                  (0, _billing.addBillData)(req, res, next);
                }).then(function (billOutput) {
                  req.query.billing_header_id = billOutput.insertId;
                  req.body.billing_header_id = billOutput.insertId;

                  var receipt = new _nodeLinq.LINQ(output).Where(function (w) {
                    return w.module_desc == "RECEIPT";
                  }).FirstOrDefault();
                  req.body.receipt_number = receipt.completeNumber;
                  return new _bluebird2.default(function (resolve, reject) {
                    (0, _logging.debugLog)("Inside Receipts");
                    delete req["options"]["onFailure"];
                    delete req["options"]["onSuccess"];
                    req.options.onFailure = function (error) {
                      reject(error);
                    };
                    req.options.onSuccess = function (records) {
                      resolve(records);
                    };
                    (0, _billing.newReceiptData)(req, res, next);
                  }).then(function (records) {
                    return new _bluebird2.default(function (resolve, reject) {
                      (0, _logging.debugLog)("Inside Episode");
                      delete req["options"]["onFailure"];
                      delete req["options"]["onSuccess"];
                      req.options.onFailure = function (error) {
                        reject(error);
                      };
                      req.options.onSuccess = function (records) {
                        resolve(records);
                      };
                      (0, _logging.debugLog)("Visit", records);
                      (0, _billing.addEpisodeEncounterData)(req, res, next);
                    }).then(function (encounterResult) {
                      connection.commit(function (error) {
                        if (error) {
                          (0, _utils.releaseDBConnection)(db, connection);
                          next(error);
                        }
                        req.records = encounterResult;
                        if (requestCounter != 0) requestCounter = requestCounter - 1;
                        next();
                      });
                    });
                  });
                });
              });
            });
          }).catch(function (error) {
            if (requestCounter != 0) requestCounter = requestCounter - 1;
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          });
        }).catch(function (error) {
          if (requestCounter != 0) requestCounter = requestCounter - 1;
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        });
      });
      //bign tr
    });
  } catch (e) {
    next(e);
  }
};

var selectFrontDesk = function selectFrontDesk(req, res, next) {
  var selectWhere = {
    patient_code: "ALL",
    hims_d_patient_id: "ALL"
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
      var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
      connection.query("SELECT  `hims_d_patient_id`, `patient_code`\
      , `registration_date`, `title_id`,`first_name`, `middle_name`, `last_name`,`full_name`, `arabic_name`\
      , `gender`, `religion_id`,`date_of_birth`, `age`, `marital_status`, `address1`\
      , `address2`,`contact_number`, `secondary_contact_number`, `email`\
      , `emergency_contact_name`,`emergency_contact_number`, `relationship_with_patient`\
      , `visa_type_id`,`nationality_id`, `postal_code`, `primary_identity_id`\
      , `primary_id_no`,`secondary_identity_id`, `secondary_id_no`, `photo_file`\
      , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id`, `advance_amount` FROM `hims_f_patient` \
       WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        var showresult = void 0;
        if (result.length != 0) {
          var hims_d_patient_id = result[0]["hims_d_patient_id"];
          connection.query("SELECT 0 radioselect, `hims_f_patient_visit_id`, `patient_id`,`visit_code`\
            , `visit_type`, `visit_date`, `department_id`, `sub_department_id`\
            , `doctor_id`, `maternity_patient`, `is_mlc`, `mlc_accident_reg_no`\
            , `mlc_police_station`, `mlc_wound_certified_date`, `insured`, `sec_insured`\
             FROM `hims_f_patient_visit` WHERE `record_status`='A' AND \
             patient_id=? ORDER BY hims_f_patient_visit_id desc ", [hims_d_patient_id], function (error, resultFields) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            showresult = {
              patientRegistration: result[0],
              visitDetails: resultFields
            };
            req.records = showresult;
            next();
          });
        } else {
          req.records = showresult;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

var updateCounter = 0;
//created by irfan :to update front desk
var updateFrontDesk = function updateFrontDesk(req, res, next) {
  (0, _logging.debugFunction)("updateFrontDesk");

  updateCounter = updateCounter + 1;
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    if (req.query["data"] != null) {
      req.query = JSON.parse(req.query["data"]);
      req.body = req.query;
    }

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
        (0, _logging.debugFunction)("updateFrontDesk Promise");
        return new _bluebird2.default(function (resolve, reject) {
          (0, _utils.runningNumberGen)({
            db: connection,
            counter: updateCounter,
            module_desc: ["PAT_VISIT", "PAT_BILL", "RECEIPT"],
            onFailure: function onFailure(error) {
              reject(error);
            },
            onSuccess: function onSuccess(result) {
              resolve(result);
            }
          });
        }).then(function (output) {
          //Get  new visit running number.

          var visit = new _nodeLinq.LINQ(output).Where(function (w) {
            return w.module_desc == "PAT_VISIT";
          }).FirstOrDefault();
          (0, _logging.debugLog)("patientInsertedRecord ", visit);

          req.query.visit_code = visit.completeNumber;
          req.body.visit_code = visit.completeNumber;

          //Visit Promise
          return new _bluebird2.default(function (resolve, reject) {
            (0, _logging.debugLog)("Inside Visit");

            req.options = {
              db: connection,
              onFailure: function onFailure(error) {
                reject(error);
              },
              onSuccess: function onSuccess(result) {
                resolve(result);
              }
            };
            (0, _logging.debugLog)("Inside Conn");
            // req.options.onFailure = error => {
            //   reject(error);
            // };
            // req.options.onSuccess = result => {
            //   resolve(result);
            // };
            // Calling Visit
            (0, _visit.insertPatientVisitData)(req, res, next);
          }).then(function (visitData) {
            req.query.visit_id = visitData["insertId"];
            req.visit_id = visitData["insertId"];
            req.body.visit_id = visitData["insertId"];
            req.body.patient_visit_id = visitData["insertId"];
            (0, _logging.debugLog)("Gen Visit ", visitData);
            //Insurance Promise
            return new _bluebird2.default(function (resolve, reject) {
              (0, _logging.debugLog)("Inside Insurance");
              if (req.body.insured == "Y") {
                delete req["options"]["onFailure"];
                delete req["options"]["onSuccess"];
                req.options.onFailure = function (error) {
                  reject(error);
                };
                req.options.onSuccess = function (data) {
                  resolve(data);
                };
                //Check for insurace
                (0, _insurance.addPatientInsuranceData)(req, res, next);
              } else {
                resolve({});
              }
            }).then(function (insuredRecords) {
              (0, _logging.debugLog)("Orver all records number gen", output);
              var bill = new _nodeLinq.LINQ(output).Where(function (w) {
                return w.module_desc == "PAT_BILL";
              }).FirstOrDefault();
              req.bill_number = bill.completeNumber;
              req.body.bill_number = bill.completeNumber;
              //Bill generation
              return new _bluebird2.default(function (resolve, reject) {
                (0, _logging.debugLog)("Inside Billing");
                delete req["options"]["onFailure"];
                delete req["options"]["onSuccess"];
                req.options.onFailure = function (error) {
                  reject(error);
                };
                req.options.onSuccess = function (data) {
                  resolve(data);
                };

                (0, _billing.addBillData)(req, res, next);
              }).then(function (billOutput) {
                req.query.billing_header_id = billOutput.insertId;
                req.body.billing_header_id = billOutput.insertId;

                var receipt = new _nodeLinq.LINQ(output).Where(function (w) {
                  return w.module_desc == "RECEIPT";
                }).FirstOrDefault();
                req.body.receipt_number = receipt.completeNumber;
                return new _bluebird2.default(function (resolve, reject) {
                  (0, _logging.debugLog)("Inside Receipts");
                  delete req["options"]["onFailure"];
                  delete req["options"]["onSuccess"];
                  req.options.onFailure = function (error) {
                    reject(error);
                  };
                  req.options.onSuccess = function (records) {
                    resolve(records);
                  };
                  (0, _billing.newReceiptData)(req, res, next);
                }).then(function (records) {
                  return new _bluebird2.default(function (resolve, reject) {
                    (0, _logging.debugLog)("Inside Episode");
                    delete req["options"]["onFailure"];
                    delete req["options"]["onSuccess"];
                    req.options.onFailure = function (error) {
                      reject(error);
                    };
                    req.options.onSuccess = function (records) {
                      resolve(records);
                    };
                    (0, _billing.addEpisodeEncounterData)(req, res, next);
                  }).then(function (encounterResult) {
                    connection.commit(function (error) {
                      if (error) {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      }
                      req.records = encounterResult;
                      if (updateCounter != 0) updateCounter = updateCounter - 1;
                      next();
                    });
                  });
                });
              });
            });
          });
        }).catch(function (error) {
          if (updateCounter != 0) updateCounter = updateCounter - 1;
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
  // debugFunction("updateFrontDesk");

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   if (req.query["data"] != null) {
  //     req.query = JSON.parse(req.query["data"]);
  //     req.body = req.query;
  //   }

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     connection.beginTransaction(error => {
  //       if (error) {
  //         connection.rollback(() => {
  //           releaseDBConnection(db, connection);
  //           next(error);
  //         });
  //       }
  //       //Front Desk updation

  //       //Visit Insertion for update front desk API
  //       //query 1
  //       runningNumber(
  //         req.db,
  //         2,
  //         "VISIT_NUMGEN",
  //         (error, patResults, completeNum) => {
  //           if (error) {
  //             connection.rollback(() => {
  //               releaseDBConnection(db, connection);
  //               next(error);
  //             });
  //           }
  //           req.query.visit_code = completeNum;
  //           req.body.visit_code = completeNum;
  //           debugLog("req.body.visit_code : " + completeNum);

  //           //call
  //           insertVisitData(
  //             connection,
  //             req,
  //             res,
  //             (error, resultdata) => {
  //               if (error) {
  //                 connection.rollback(() => {
  //                   releaseDBConnection(db, connection);
  //                   next(error);
  //                 });
  //               }

  //               //Billing Insertion for update front desk APi
  //               //Quwery:2
  //               if (resultdata != null && resultdata.length != 0) {
  //                 req.query.visit_id = resultdata["insertId"];
  //                 req.body.visit_id = resultdata["insertId"];
  //                 req.body.patient_visit_id = resultdata["insertId"];
  //                 debugLog("req.body.visit_id:" + resultdata["insertId"]);

  //                 debugLog(" result of visit func", resultdata);

  //                 //add patient insurance

  //                 if (req.body.insured == "Y") {
  //                   addPatientInsurance(
  //                     connection,
  //                     req,
  //                     res,
  //                     (error, result) => {
  //                       if (error) {
  //                         debugLog("error in adding insurence", error);
  //                         connection.rollback(() => {
  //                           releaseDBConnection(db, connection);
  //                           next(error);
  //                         });
  //                       }

  //                       debugLog("add insuence result:", result);
  //                     }
  //                   );
  //                 }

  //                 //call
  //                 addBill(
  //                   connection,
  //                   req,
  //                   res,
  //                   (error, result) => {
  //                     if (error) {
  //                       connection.rollback(() => {
  //                         releaseDBConnection(db, connection);
  //                         next(error);
  //                       });
  //                     }

  //                     //Query :3
  //                     //insert receipt for update front desk api

  //                     if (result != null && result.length != 0) {
  //                       req.query.billing_header_id = result.insertId;
  //                       req.body.billing_header_id = result.insertId;

  //                       debugLog(
  //                         "  req.body.billing_header_id:" + result["insertId"]
  //                       );

  //                       //call

  //                       newReceipt(
  //                         connection,
  //                         req,
  //                         res,
  //                         (error, resultdata) => {
  //                           if (error) {
  //                             connection.rollback(() => {
  //                               releaseDBConnection(db, connection);
  //                               next(error);
  //                             });
  //                           }
  //                           connection.commit(error => {
  //                             releaseDBConnection(db, connection);
  //                             if (error) {
  //                               connection.rollback(() => {
  //                                 next(error);
  //                               });
  //                             }
  //                             req.records = result;
  //                             next();
  //                           });

  //                           debugLog("succes result of query 3 : ", resultdata);
  //                         },
  //                         next
  //                       );
  //                     }
  //                   },

  //                   next
  //                 );
  //               }
  //             },
  //             true,
  //             next
  //           );
  //         }
  //       );
  //     });
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

module.exports = {
  addFrontDesk: addFrontDesk,
  selectFrontDesk: selectFrontDesk,
  updateFrontDesk: updateFrontDesk
};
//# sourceMappingURL=frontDesk.js.map