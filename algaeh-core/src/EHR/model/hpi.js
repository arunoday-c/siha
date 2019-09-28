"use strict";
import extend from "extend";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
//import { LINQ } from "node-linq";

import logUtils from "../../utils/logging";

const { debugFunction, debugLog } = logUtils;
const { releaseDBConnection, jsonArrayToObject } = utils;

//code

//created by irfan:  to add ICD
let addIcd = (req, res, next) => {
  let addIcdModel = {
    hims_d_icd_id: null,
    icd_code: null,
    icd_description: null,
    long_icd_description: null,
    icd_level: null,
    icd_type: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addIcd");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(addIcdModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_icd(\
            icd_code,icd_description,long_icd_description,icd_level,icd_type,created_by,updated_by)values(\
                ?,?,?,?,?,?,?)",
        [
          input.icd_code,
          input.icd_description,
          input.long_icd_description,
          input.icd_level,
          input.icd_type,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add  hpi header and details
let addPlanAndPolicy = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

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

        let model = {};

        let jsonArr = extend(models, req.body);

        for (let i = 0; i < jsonArr.length; i++) {
          let obj = jsonArr[i];
          debugLog("single:", obj);

          connection.query(
            "INSERT INTO hims_d_insurance_network(`network_type`,`insurance_provider_id`,`insurance_sub_id`,\
        `effective_start_date`,`effective_end_date`,`created_date`,`created_by`,\
        `updated_date`,`updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?)",
            [
              obj.network_type,
              obj.insurance_provider_id,
              obj.insurance_sub_id,
              obj.effective_start_date,
              obj.effective_end_date,
              new Date(),
              obj.created_by,
              new Date(),
              obj.updated_by
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              // req.records = result;
              // next();
              if (result != null && result.length != 0) {
                obj.network_id = result["insertId"];

                // let inputparam = extend(NetworkOfficeModel, req.body);
                connection.query(
                  "INSERT INTO hims_d_insurance_network_office(`network_id`,`hospital_id`,`deductible`,`deductable_type`,`min_value`,`max_value`,`copay_consultation`,\
              `deductible_lab`,`for_alllab`,`copay_percent`,`deductible_rad`,`for_allrad`,`copay_percent_rad`,`copay_percent_trt`,\
              `copay_percent_dental`,`copay_medicine`,`insur_network_limit`,`deductible_trt`,`deductible_dental`,`deductible_medicine`,`lab_min`,\
              `lab_max`,`rad_min`,`rad_max`,`trt_max`,`trt_min`,`dental_min`,`dental_max`,`medicine_min`,`medicine_max`,`invoice_max_liability`,\
              `for_alltrt`,`for_alldental`,`for_allmedicine`,`invoice_max_deduct`,`price_from`,`employer`,`policy_number`,`follow_up`,`preapp_limit`,\
              `deductible_ip`,`copay_ip`,`ip_min`,`ip_max`,`for_allip`,`consult_limit`,`preapp_limit_from`,`copay_maternity`,`maternity_min`,`maternity_max`,\
              `copay_optical`,`optical_min`,`optical_max`,`copay_diagnostic`,`diagnostic_min`,`diagnostic_max`,`created_date`,`created_by`,`updated_date`,`updated_by`)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    obj.network_id,
                    obj.hospital_id,
                    obj.deductible,
                    obj.deductable_type,
                    obj.min_value,
                    obj.max_value,
                    obj.copay_consultation,
                    obj.deductible_lab,
                    obj.for_alllab,
                    obj.copay_percent,
                    obj.deductible_rad,
                    obj.for_allrad,
                    obj.copay_percent_rad,
                    obj.copay_percent_trt,
                    obj.copay_percent_dental,
                    obj.copay_medicine,
                    obj.insur_network_limit,
                    obj.deductible_trt,
                    obj.deductible_dental,
                    obj.deductible_medicine,
                    obj.lab_min,
                    obj.lab_max,
                    obj.rad_min,
                    obj.rad_max,
                    obj.trt_max,
                    obj.trt_min,
                    obj.dental_min,
                    obj.dental_max,
                    obj.medicine_min,
                    obj.medicine_max,
                    obj.invoice_max_liability,
                    obj.for_alltrt,
                    obj.for_alldental,
                    obj.for_allmedicine,
                    obj.invoice_max_deduct,
                    obj.price_from,
                    obj.employer,
                    obj.policy_number,
                    obj.follow_up,
                    obj.preapp_limit,
                    obj.deductible_ip,
                    obj.copay_ip,
                    obj.ip_min,
                    obj.ip_max,
                    obj.for_allip,
                    obj.consult_limit,
                    obj.preapp_limit_from,
                    obj.copay_maternity,
                    obj.maternity_min,
                    obj.maternity_max,
                    obj.copay_optical,
                    obj.optical_min,
                    obj.optical_max,
                    obj.copay_diagnostic,
                    obj.diagnostic_min,
                    obj.diagnostic_max,
                    new Date(),
                    obj.created_by,
                    new Date(),
                    obj.updated_by
                  ],
                  (error, resultoff) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      req.records = resultoff;
                      next();
                    });
                    // req.records = resultoff;
                    // next();
                  }
                );
              }
            }
          );
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

// created by : irfan to get chief complaint elements (hpi details)
let getHpiElements = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_hpi_details_id,hpi_header_id,element_description,element_type,created_date \
        from hims_d_hpi_details  where hpi_header_id=? and record_status='A';",
        [inputData.hpi_header_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

// created by : irfan to ADD chief complaint elements(hpi details)
let addHpiElement = (req, res, next) => {
  debugFunction("addHpiElement");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        connection.query(
          "insert into hims_d_hpi_details(hpi_header_id,element_description,element_type,created_date,created_by,updated_date,updated_by) \
        values(?,?,?,?,?,?,?)",
          [
            input.hpi_header_id,
            input.element_description,
            input.element_type,
            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ],
          (error, results) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            //adding HPI element to [patient]

            if (input.patient_id != null && results.insertId != null) {
              connection.query(
                "insert into hims_f_episode_hpi(patient_id,episode_id, hpi_header_id, hpi_detail_id,\
                  created_date,created_by,updated_date,updated_by,hospital_id) \
                 values(?,?,?,?,?,?,?,?,?)",
                [
                  input.patient_id,
                  input.episode_id,
                  input.hpi_header_id,
                  results.insertId,
                  new Date(),
                  input.created_by,
                  new Date(),
                  input.updated_by,
                  req.userIdentity.hospital_id
                ],
                (error, resultPatientEP) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    releaseDBConnection(db, connection);
                    req.records = resultPatientEP;
                    next();
                  });
                }
              );
            } else {
              debugFunction("esle");
              connection.commit(error => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                releaseDBConnection(db, connection);
                req.records = results;
                next();
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

// created by : irfan to addPatientHpi
let addPatientHpiBACKUP = (req, res, next) => {
  debugFunction("addPatientHpi");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_f_episode_hpi(patient_id,episode_id, hpi_header_id, hpi_detail_id,created_date,created_by,updated_date,updated_by) \
        values(?,?,?,?,?,?,?,?)",
        [
          input.patient_id,
          input.episode_id,
          input.hpi_header_id,
          input.hpi_detail_id,

          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

// created by : irfan to addPatientHpi
let addPatientHpi = (req, res, next) => {
  debugFunction("addPatientHpi");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      const insurtColumns = ["hpi_detail_id", "created_by", "updated_by"];

      connection.query(
        "INSERT INTO hims_f_episode_hpi(" +
          insurtColumns.join(",") +
          ",patient_id,episode_id, hpi_header_id,created_date,updated_date,hospital_id) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.hpi_detail_ids,
            newFieldToInsert: [
              input.patient_id,
              input.episode_id,
              input.hpi_header_id,
              new Date(),
              new Date(),
              req.userIdentity.hospital_id
            ],
            req: req
          })
        ],

        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

// created by : irfan to getPatientHpi hpi elements
let getPatientHpi = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select EH.patient_id, EH.hpi_header_id,hpi_description as chief_complaint, hpi_detail_id, HD.element_description,HD.element_type, episode_id\
        from hims_f_episode_hpi EH,hims_d_hpi_details HD,hims_d_hpi_header HH\
        where EH.record_status='A' and   HH.record_status='A'  and  HD.record_status='A'  and\
        EH.hpi_detail_id=HD.hims_d_hpi_details_id and \
        EH.hpi_header_id=HH.hims_d_hpi_header_id and EH.episode_id=?;",
        [inputData.episode_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

export default {
  addIcd,
  getHpiElements,
  addHpiElement,
  addPatientHpi,
  getPatientHpi
};

// localhost:3002/api/v1/doctorsWorkBench/getPatientVitals?patient_id=48

// localhost:3002/api/v1/doctorsWorkBench/addPatientVitals

// {

//   "patient_id":48,
//            "visit_id":93,
//            "visit_date":"20180909",
//            "visit_time":"12:12:00",
//            "case_type":"op",
//            "vital_id":1,
//            "vital_value":10,
//            "vital_value_one":null,
//            "vital_value_two":null,
//            "formula_value":null

// }

// localhost:3002/api/v1/doctorsWorkBench/getVitalsHeaderMaster
