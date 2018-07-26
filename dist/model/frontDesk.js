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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan :to save front desk data inputs
var addFrontDesk = function addFrontDesk(req, res, next) {
  (0, _logging.debugFunction)("addFrontDesk");
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
        //Front Desk Insertion
        //Patient Details Insertion
        //Start
        //Quwery:1
        (0, _utils.runningNumber)(connection, 1, "PATCODE_NUMGEN", function (error, records, newNumber) {
          (0, _logging.debugLog)("newNumber:" + newNumber);
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          if (records.length != 0) {
            req.query.patient_code = newNumber;
            req.body.patient_code = newNumber;

            //call
            (0, _patientRegistration.insertData)(connection, req, res, function (error, result) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              if (result != null && result.length != 0) {
                req.query.patient_id = result[0][0]["hims_d_patient_id"];
                req.body.patient_id = result[0][0]["hims_d_patient_id"];
                (0, _logging.debugLog)("req.body.patient_id:" + result[0][0]["hims_d_patient_id"]);
                (0, _logging.debugLog)(" succes result of first query", result);

                //Visit Insertion
                //query 2
                (0, _utils.runningNumber)(req.db, 2, "VISIT_NUMGEN", function (error, patResults, completeNum) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }
                  req.query.visit_code = completeNum;
                  req.body.visit_code = completeNum;
                  (0, _logging.debugLog)("req.body.visit_code : " + completeNum);

                  //call
                  (0, _visit.insertVisitData)(connection, req, res, function (error, resultdata) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }

                    //Billing Insertion
                    //Quwery:3
                    if (resultdata != null && resultdata.length != 0) {
                      req.query.visit_id = resultdata["insertId"];
                      req.body.visit_id = resultdata["insertId"];
                      req.body.patient_visit_id = resultdata["insertId"];
                      (0, _logging.debugLog)("req.body.visit_id:" + resultdata["insertId"]);

                      (0, _logging.debugLog)(" succes result of second query", resultdata);

                      //add patient insurance

                      if (req.body.insured == "Y") {
                        (0, _insurance.addPatientInsurance)(connection, req, res, function (error, result) {
                          if (error) {
                            (0, _logging.debugLog)("error in adding insurence", error);
                            connection.rollback(function () {
                              (0, _utils.releaseDBConnection)(db, connection);
                              next(error);
                            });
                          }

                          (0, _logging.debugLog)("add insuence result:", result);
                        });
                      }

                      //call
                      (0, _billing.addBill)(connection, req, res, function (error, result) {
                        if (error) {
                          connection.rollback(function () {
                            (0, _utils.releaseDBConnection)(db, connection);
                            next(error);
                          });
                        }

                        //Query :4
                        //insert receipt

                        if (result != null && result.length != 0) {
                          req.query.billing_header_id = result.insertId;
                          req.body.billing_header_id = result.insertId;

                          (0, _logging.debugLog)("  req.body.billing_header_id:" + result["insertId"]);

                          //call

                          (0, _billing.newReceipt)(connection, req, res, function (error, resultdata) {
                            if (error) {
                              connection.rollback(function () {
                                (0, _utils.releaseDBConnection)(db, connection);
                                next(error);
                              });
                            }

                            (0, _logging.debugLog)("succes result of query 4 : ", resultdata);

                            //call to addEpisodeEncounter

                            (0, _billing.addEpisodeEncounter)(connection, req, res, function (error, resultEp) {
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
                                req.records = resultEp;
                                next();
                              });

                              (0, _logging.debugLog)("succes result of query 5 : ", resultEp);
                            }, next);
                            //end of episode
                          }, next);
                        }
                      }, next);
                    }
                  });
                });
              }
            }, true, next);
          }
        });
        //ruunin
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

//created by irfan :to update front desk
var updateFrontDesk = function updateFrontDesk(req, res, next) {
  (0, _logging.debugFunction)("updateFrontDesk");
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
        //Front Desk updation

        //Visit Insertion for update front desk API
        //query 1
        (0, _utils.runningNumber)(req.db, 2, "VISIT_NUMGEN", function (error, patResults, completeNum) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          req.query.visit_code = completeNum;
          req.body.visit_code = completeNum;
          (0, _logging.debugLog)("req.body.visit_code : " + completeNum);

          //call
          (0, _visit.insertVisitData)(connection, req, res, function (error, resultdata) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            //Billing Insertion for update front desk APi
            //Quwery:2
            if (resultdata != null && resultdata.length != 0) {
              req.query.visit_id = resultdata["insertId"];
              req.body.visit_id = resultdata["insertId"];
              req.body.patient_visit_id = resultdata["insertId"];
              (0, _logging.debugLog)("req.body.visit_id:" + resultdata["insertId"]);

              (0, _logging.debugLog)(" result of visit func", resultdata);

              //add patient insurance

              if (req.body.insured == "Y") {
                (0, _insurance.addPatientInsurance)(connection, req, res, function (error, result) {
                  if (error) {
                    (0, _logging.debugLog)("error in adding insurence", error);
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }

                  (0, _logging.debugLog)("add insuence result:", result);
                });
              }

              //call
              (0, _billing.addBill)(connection, req, res, function (error, result) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }

                //Query :3
                //insert receipt for update front desk api

                if (result != null && result.length != 0) {
                  req.query.billing_header_id = result.insertId;
                  req.body.billing_header_id = result.insertId;

                  (0, _logging.debugLog)("  req.body.billing_header_id:" + result["insertId"]);

                  //call

                  (0, _billing.newReceipt)(connection, req, res, function (error, resultdata) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    connection.commit(function (error) {
                      (0, _utils.releaseDBConnection)(db, connection);
                      if (error) {
                        connection.rollback(function () {
                          next(error);
                        });
                      }
                      req.records = result;
                      next();
                    });

                    (0, _logging.debugLog)("succes result of query 3 : ", resultdata);
                  }, next);
                }
              }, next);
            }
          }, true, next);
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addFrontDesk: addFrontDesk,
  selectFrontDesk: selectFrontDesk,
  updateFrontDesk: updateFrontDesk
};
//# sourceMappingURL=frontDesk.js.map