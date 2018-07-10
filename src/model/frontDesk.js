import { insertData } from "../model/patientRegistration";
import { insertVisitData } from "../model/visit";
import { whereCondition, runningNumber, releaseDBConnection } from "../utils";
import extend from "extend";
import { addBill, newReceipt } from "../model/billing";
import httpStatus from "../utils/httpStatus";
import { debugLog, debugFunction } from "../utils/logging";

let addFrontDesk = (req, res, next) => {
  debugFunction("addFrontDesk");
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
        //Front Desk Insertion
        //Patient Details Insertion
        //Start
        //Quwery:1
        runningNumber(
          req.db,
          1,
          "PATCODE_NUMGEN",
          (error, records, newNumber) => {
            debugLog("newNumber:" + newNumber);
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            if (records.length != 0) {
              req.query.patient_code = newNumber;
              req.body.patient_code = newNumber;

              //call
              insertData(
                connection,
                req,
                res,
                (error, result) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  if (result != null && result.length != 0) {
                    req.query.patient_id = result[0][0]["hims_d_patient_id"];
                    req.body.patient_id = result[0][0]["hims_d_patient_id"];
                    debugLog(
                      "req.body.patient_id:" + result[0][0]["hims_d_patient_id"]
                    );
                    debugLog(" succes result of first query", result);

                    //Visit Insertion
                    //query 2
                    runningNumber(
                      req.db,
                      2,
                      "VISIT_NUMGEN",
                      (error, patResults, completeNum) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        req.query.visit_code = completeNum;
                        req.body.visit_code = completeNum;
                        debugLog("req.body.visit_code : " + completeNum);

                        //call
                        insertVisitData(
                          connection,
                          req,
                          res,
                          (error, resultdata) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            //Billing Insertion
                            //Quwery:3
                            if (resultdata != null && resultdata.length != 0) {
                              req.query.visit_id = resultdata["insertId"];
                              req.body.visit_id = resultdata["insertId"];

                              debugLog(
                                "req.body.visit_id:" + resultdata["insertId"]
                              );

                              debugLog(
                                " succes result of second query",
                                resultdata
                              );
                              //call
                              addBill(
                                connection,
                                req,
                                res,
                                (error, result) => {
                                  if (error) {
                                    connection.rollback(() => {
                                      releaseDBConnection(db, connection);
                                      next(error);
                                    });
                                  }

                                  //Query :4
                                  //insert receipt

                                  if (result != null && result.length != 0) {
                                    req.query.billing_header_id =
                                      result.insertId;
                                    req.body.billing_header_id =
                                      result.insertId;

                                    debugLog(
                                      "  req.body.billing_header_id:" +
                                        result["insertId"]
                                    );

                                    //call

                                    newReceipt(
                                      connection,
                                      req,
                                      res,
                                      (error, resultdata) => {
                                        if (error) {
                                          connection.rollback(() => {
                                            releaseDBConnection(db, connection);
                                            next(error);
                                          });
                                        }
                                        connection.commit(error => {
                                          releaseDBConnection(db, connection);
                                          if (error) {
                                            connection.rollback(() => {
                                              next(error);
                                            });
                                          }
                                          req.records = result;
                                          next();
                                        });

                                        debugLog(
                                          "succes result of query 4 : ",
                                          resultdata
                                        );
                                      },
                                      next
                                    );
                                  }
                                },

                                next
                              );
                            }
                          }
                        );
                      }
                    );
                  }
                },
                true,
                next
              );
            }
          }
        );
        //ruunin
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
      , `primary_id_no`,`secondary_identity_id`, `secondary_id_no`, `photo_file`\
      , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id`, `advance_amount` FROM `hims_f_patient` \
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
            , `mlc_police_station`, `mlc_wound_certified_date`\
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
                next();
              }
            );
          } else {
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

let updateFrontDesk = (req, res, next) => {
  debugFunction("updateFrontDesk");
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
        //Front Desk updation

        //Visit Insertion for update front desk API
        //query 1
        runningNumber(
          req.db,
          2,
          "VISIT_NUMGEN",
          (error, patResults, completeNum) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            req.query.visit_code = completeNum;
            req.body.visit_code = completeNum;
            debugLog("req.body.visit_code : " + completeNum);

            //call
            insertVisitData(
              connection,
              req,
              res,
              (error, resultdata) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                //Billing Insertion for update front desk APi
                //Quwery:2
                if (resultdata != null && resultdata.length != 0) {
                  req.query.visit_id = resultdata["insertId"];
                  req.body.visit_id = resultdata["insertId"];

                  debugLog("req.body.visit_id:" + resultdata["insertId"]);

                  debugLog(" succes result of second query", resultdata);
                  //call
                  addBill(
                    connection,
                    req,
                    res,
                    (error, result) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      //Query :3
                      //insert receipt for update front desk api

                      if (result != null && result.length != 0) {
                        req.query.billing_header_id = result.insertId;
                        req.body.billing_header_id = result.insertId;

                        debugLog(
                          "  req.body.billing_header_id:" + result["insertId"]
                        );

                        //call

                        newReceipt(
                          connection,
                          req,
                          res,
                          (error, resultdata) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            connection.commit(error => {
                              releaseDBConnection(db, connection);
                              if (error) {
                                connection.rollback(() => {
                                  next(error);
                                });
                              }
                              req.records = result;
                              next();
                            });

                            debugLog("succes result of query 3 : ", resultdata);
                          },
                          next
                        );
                      }
                    },

                    next
                  );
                }
              },
              true,
              next
            );
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addFrontDesk,
  selectFrontDesk,
  updateFrontDesk
};
