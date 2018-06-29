import { insertData } from "../model/patientRegistration";
import { insertVisitData } from "../model/visit";
import { whereCondition, runningNumber, releaseDBConnection } from "../utils";
import extend from "extend";
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
        runningNumber(
          connection,
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
              connection.beginTransaction(error => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                req.query.patient_code = newNumber;
                req.body.patient_code = newNumber;
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
                        "req.body.patient_id:" +
                          result[0][0]["hims_d_patient_id"]
                      );
                      runningNumber(
                        connection,
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
                              connection.commit(error => {
                                releaseDBConnection(db, connection);
                                if (error) {
                                  connection.rollback(() => {
                                    next(error);
                                  });
                                }
                                debugLog(
                                  "patient_code : " + req.body.patient_code
                                );
                                resultdata["patient_code"] =
                                  req.body.patient_code;
                                resultdata["visit_code"] = req.body.visit_code;
                                req.records = resultdata;
                                //Upload Images to server.
                                // createFolder(req, res);
                                next();
                                return;
                              });
                            }
                          );
                        }
                      );
                    } else {
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
                    }
                  },
                  true,
                  next
                );
              });
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};
let selectWhere = {
  patient_code: "ALL",
  hims_d_patient_id: "ALL"
};
let selectFrontDesk = (req, res, next) => {
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
      , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id` FROM `hims_f_patient` \
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
module.exports = {
  addFrontDesk,
  selectFrontDesk
};
