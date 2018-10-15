import { insertData, insertPatientData } from "../model/patientRegistration";
import { insertVisitData, insertPatientVisitData } from "../model/visit";
import {
  whereCondition,
  runningNumber,
  runningNumberGen,
  releaseDBConnection
} from "../utils";
import extend from "extend";
import {
  addBill,
  newReceipt,
  addEpisodeEncounter,
  addBillData,
  newReceiptData,
  addEpisodeEncounterData
} from "../model/billing";
import {
  addPatientInsurance,
  addPatientInsuranceData
} from "../model/insurance";
import httpStatus from "../utils/httpStatus";
import { debugLog, debugFunction } from "../utils/logging";
import Promise from "bluebird";
import { LINQ } from "node-linq";
let requestCounter = 0;
//created by irfan :to save front desk data inputs
let addFrontDesk = (req, res, next) => {
  debugFunction("addFrontDesk");

  requestCounter = requestCounter + 1;
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (req.query["data"] != null) {
      req.query = JSON.parse(req.query["data"]);
      req.body = req.query;
    }

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        return new Promise((resolve, reject) => {
          runningNumberGen({
            db: connection,
            counter: requestCounter,
            module_desc: ["PAT_REGS", "PAT_VISIT", "PAT_BILL", "RECEIPT"],
            onFailure: error => {
              reject(error);
            },
            onSuccess: result => {
              resolve(result);
            }
          });
        })
          .then(output => {
            //Calling Patient Registration function
            let patients = new LINQ(output)
              .Where(w => w.module_desc == "PAT_REGS")
              .FirstOrDefault();

            req.query.patient_code = patients.completeNumber;
            req.body.patient_code = patients.completeNumber;
            return new Promise((resolve, reject) => {
              req.options = {
                db: connection,
                onFailure: error => {
                  reject(error);
                },
                onSuccess: result => {
                  resolve(result);
                }
              };
              insertPatientData(req, res, next);
            })
              .then(patientInsertedRecord => {
                //Get  new visit running number.
                let visit = new LINQ(output)
                  .Where(w => w.module_desc == "PAT_VISIT")
                  .FirstOrDefault();
                debugLog("patientInsertedRecord ", patientInsertedRecord);

                req.query.visit_code = visit.completeNumber;
                req.body.visit_code = visit.completeNumber;
                delete req["options"]["onFailure"];
                delete req["options"]["onSuccess"];
                //Visit Promise
                return new Promise((resolve, reject) => {
                  debugLog("Inside Visit");
                  req.options.onFailure = error => {
                    reject(error);
                  };
                  req.options.onSuccess = result => {
                    resolve(result);
                  };
                  // Calling Visit
                  insertPatientVisitData(req, res, next);
                }).then(visitData => {
                  req.query.visit_id = visitData["insertId"];
                  req.visit_id = visitData["insertId"];
                  req.body.visit_id = visitData["insertId"];
                  req.body.patient_visit_id = visitData["insertId"];
                  debugLog("Gen Visit ", visitData);
                  //Insurance Promise
                  return new Promise((resolve, reject) => {
                    debugLog("Inside Insurance");
                    if (req.body.insured == "Y") {
                      delete req["options"]["onFailure"];
                      delete req["options"]["onSuccess"];
                      req.options.onFailure = error => {
                        reject(error);
                      };
                      req.options.onSuccess = data => {
                        resolve(data);
                      };
                      //Check for insurace
                      addPatientInsuranceData(req, res, next);
                    } else {
                      resolve({});
                    }
                  }).then(insuredRecords => {
                    debugLog("Orver all records number gen", output);
                    let bill = new LINQ(output)
                      .Where(w => w.module_desc == "PAT_BILL")
                      .FirstOrDefault();
                    req.bill_number = bill.completeNumber;
                    req.body.bill_number = bill.completeNumber;
                    //Bill generation
                    return new Promise((resolve, reject) => {
                      debugLog("Inside Billing");
                      delete req["options"]["onFailure"];
                      delete req["options"]["onSuccess"];
                      req.options.onFailure = error => {
                        reject(error);
                      };
                      req.options.onSuccess = data => {
                        resolve(data);
                      };

                      addBillData(req, res, next);
                    }).then(billOutput => {
                      req.query.billing_header_id = billOutput.insertId;
                      req.body.billing_header_id = billOutput.insertId;

                      let receipt = new LINQ(output)
                        .Where(w => w.module_desc == "RECEIPT")
                        .FirstOrDefault();
                      req.body.receipt_number = receipt.completeNumber;
                      return new Promise((resolve, reject) => {
                        debugLog("Inside Receipts");
                        delete req["options"]["onFailure"];
                        delete req["options"]["onSuccess"];
                        req.options.onFailure = error => {
                          reject(error);
                        };
                        req.options.onSuccess = records => {
                          resolve(records);
                        };
                        newReceiptData(req, res, next);
                      }).then(records => {
                        return new Promise((resolve, reject) => {
                          debugLog("Inside Episode");
                          delete req["options"]["onFailure"];
                          delete req["options"]["onSuccess"];
                          req.options.onFailure = error => {
                            reject(error);
                          };
                          req.options.onSuccess = records => {
                            resolve(records);
                          };
                          debugLog("Visit", records);
                          addEpisodeEncounterData(req, res, next);
                        }).then(encounterResult => {
                          connection.commit(error => {
                            debugLog("After Episode Error: ", error);
                            if (error) {
                              debugLog("Error: ", error);
                              releaseDBConnection(db, connection);
                              next(error);
                            }
                            req.records = encounterResult;
                            debugLog("encounterResult: ", encounterResult);
                            if (requestCounter != 0)
                              requestCounter = requestCounter - 1;
                            releaseDBConnection(db, connection);
                            next();
                          });
                        });
                      });
                    });
                  });
                });
              })
              .catch(error => {
                if (requestCounter != 0) requestCounter = requestCounter - 1;
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              });
          })
          .catch(error => {
            if (requestCounter != 0) requestCounter = requestCounter - 1;
            connection.rollback(() => {
              releaseDBConnection(db, connection);
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

let selectFrontDesk = (req, res, next) => {
  let selectWhere = {
    patient_code: "ALL",
    hims_d_patient_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let where = whereCondition(extend(selectWhere, req.query));
      connection.query(
        "SELECT  `hims_d_patient_id`, `patient_code`\
      , `registration_date`, `title_id`,`first_name`, `middle_name`, `last_name`,`full_name`, `arabic_name`\
      , `gender`, `religion_id`,`date_of_birth`, `age`, `marital_status`, `address1`\
      , `address2`,`contact_number`, `secondary_contact_number`, `email`\
      , `emergency_contact_name`,`emergency_contact_number`, `relationship_with_patient`\
      , `visa_type_id`,`nationality_id`, `postal_code`, `primary_identity_id`\
      , `primary_id_no`,`secondary_identity_id`, `secondary_id_no`, `photo_file`,`vat_applicable`\
      , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id`, `advance_amount`,`patient_type` FROM `hims_f_patient` \
       WHERE `record_status`='A' AND " +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let showresult;
          if (result.length != 0) {
            let hims_d_patient_id = result[0]["hims_d_patient_id"];
            connection.query(
              "SELECT 0 radioselect, `hims_f_patient_visit_id`, `patient_id`,`visit_code`\
            , `visit_type`, `visit_date`, `department_id`, `sub_department_id`\
            , `doctor_id`, `maternity_patient`, `is_mlc`, `mlc_accident_reg_no`\
            , `mlc_police_station`, `mlc_wound_certified_date`, `insured`, `sec_insured`\
             FROM `hims_f_patient_visit` WHERE `record_status`='A' AND \
             patient_id=? ORDER BY hims_f_patient_visit_id desc ",
              [hims_d_patient_id],
              (error, resultFields) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                showresult = {
                  patientRegistration: result[0],
                  visitDetails: resultFields
                };
                req.records = showresult;
                releaseDBConnection(db, connection);
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            req.records = showresult;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let updateCounter = 0;
//created by irfan :to update front desk
let updateFrontDesk = (req, res, next) => {
  debugFunction("updateFrontDesk");

  updateCounter = updateCounter + 1;
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (req.query["data"] != null) {
      req.query = JSON.parse(req.query["data"]);
      req.body = req.query;
    }

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        debugFunction("updateFrontDesk Promise");
        return new Promise((resolve, reject) => {
          runningNumberGen({
            db: connection,
            counter: updateCounter,
            module_desc: ["PAT_VISIT", "PAT_BILL", "RECEIPT"],
            onFailure: error => {
              reject(error);
            },
            onSuccess: result => {
              resolve(result);
            }
          });
        })
          .then(output => {
            //Get  new visit running number.

            let visit = new LINQ(output)
              .Where(w => w.module_desc == "PAT_VISIT")
              .FirstOrDefault();
            debugLog("patientInsertedRecord ", visit);

            req.query.visit_code = visit.completeNumber;
            req.body.visit_code = visit.completeNumber;

            //Visit Promise
            return new Promise((resolve, reject) => {
              debugLog("Inside Visit");

              req.options = {
                db: connection,
                onFailure: error => {
                  reject(error);
                },
                onSuccess: result => {
                  resolve(result);
                }
              };
              debugLog("Inside Conn");
              // req.options.onFailure = error => {
              //   reject(error);
              // };
              // req.options.onSuccess = result => {
              //   resolve(result);
              // };
              // Calling Visit
              insertPatientVisitData(req, res, next);
            }).then(visitData => {
              req.query.visit_id = visitData["insertId"];
              req.visit_id = visitData["insertId"];
              req.body.visit_id = visitData["insertId"];
              req.body.patient_visit_id = visitData["insertId"];
              debugLog("Gen Visit ", visitData);
              //Insurance Promise
              return new Promise((resolve, reject) => {
                debugLog("Inside Insurance");
                if (req.body.insured == "Y") {
                  delete req["options"]["onFailure"];
                  delete req["options"]["onSuccess"];
                  req.options.onFailure = error => {
                    reject(error);
                  };
                  req.options.onSuccess = data => {
                    resolve(data);
                  };
                  //Check for insurace
                  addPatientInsuranceData(req, res, next);
                } else {
                  resolve({});
                }
              }).then(insuredRecords => {
                debugLog("Orver all records number gen", output);
                let bill = new LINQ(output)
                  .Where(w => w.module_desc == "PAT_BILL")
                  .FirstOrDefault();
                req.bill_number = bill.completeNumber;
                req.body.bill_number = bill.completeNumber;
                //Bill generation
                return new Promise((resolve, reject) => {
                  debugLog("Inside Billing");
                  delete req["options"]["onFailure"];
                  delete req["options"]["onSuccess"];
                  req.options.onFailure = error => {
                    reject(error);
                  };
                  req.options.onSuccess = data => {
                    resolve(data);
                  };

                  addBillData(req, res, next);
                }).then(billOutput => {
                  req.query.billing_header_id = billOutput.insertId;
                  req.body.billing_header_id = billOutput.insertId;

                  let receipt = new LINQ(output)
                    .Where(w => w.module_desc == "RECEIPT")
                    .FirstOrDefault();
                  req.body.receipt_number = receipt.completeNumber;
                  return new Promise((resolve, reject) => {
                    debugLog("Inside Receipts");
                    delete req["options"]["onFailure"];
                    delete req["options"]["onSuccess"];
                    req.options.onFailure = error => {
                      reject(error);
                    };
                    req.options.onSuccess = records => {
                      resolve(records);
                    };
                    newReceiptData(req, res, next);
                  }).then(records => {
                    return new Promise((resolve, reject) => {
                      debugLog("Inside Episode");
                      delete req["options"]["onFailure"];
                      delete req["options"]["onSuccess"];
                      req.options.onFailure = error => {
                        reject(error);
                      };
                      req.options.onSuccess = records => {
                        resolve(records);
                      };
                      debugLog("Before Episode");
                      addEpisodeEncounterData(req, res, next);
                      debugLog("After Episode");
                    }).then(encounterResult => {
                      connection.commit(error => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }
                        req.records = encounterResult;
                        if (updateCounter != 0)
                          updateCounter = updateCounter - 1;
                        releaseDBConnection(db, connection);
                        next();
                      });
                    });
                  });
                });
              });
            });
          })
          .catch(error => {
            if (updateCounter != 0) updateCounter = updateCounter - 1;
            connection.rollback(() => {
              releaseDBConnection(db, connection);
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
  addFrontDesk,
  selectFrontDesk,
  updateFrontDesk
};
