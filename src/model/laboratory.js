"use strict";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import pad from "node-string-pad";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import appsettings from "../utils/appsettings.json";
import { logger, debugFunction, debugLog } from "../utils/logging";
import Promise from "bluebird";
import moment from "moment";
import extend from "extend";
//created by nowshad: to get lad orders for sample collection
let getLabOrderedServices = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    debugLog("Date: ", req.query.from_date);
    let whereOrder = "";
    if (req.query.from_date != undefined) {
      whereOrder =
        "date(ordered_date) between date('" +
        req.query.from_date +
        "') AND date('" +
        req.query.to_date +
        "')";

      debugLog("Date If: ", req.query.from_date);
    } else {
      whereOrder = "date(ordered_date) <= date(now())";
    }

    debugLog("where Order:", whereOrder);
    delete req.query.from_date;
    delete req.query.to_date;
    let where = whereCondition(req.query);

    debugLog("where conditn:", where);
    // let strQuery =
    //   "SELECT hims_f_lab_order_id,patient_id,visit_id,provider_id, service_id,SR.service_code,SR.service_name,\
    // SA.status, cancelled, ordered_date, test_type, PAT.patient_code,PAT.full_name,SP.sample_id,SP.collected,\
    // SP.collected_by, SP.collected_date,SP.hims_d_lab_sample_id from ((hims_f_lab_order SA inner join hims_f_patient PAT ON \
    // SA.patient_id=PAT.hims_d_patient_id) inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id) \
    // left outer join hims_f_lab_sample SP on SA.hims_f_lab_order_id = SP.order_id WHERE SA.record_status='A' AND " +
    //   whereOrder;

    // debugLog("strQuery: ", strQuery);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT hims_f_lab_order_id,patient_id,visit_id,provider_id, service_id,SR.service_code,SR.service_name,\
        SA.status, cancelled, provider_id, ordered_date, test_type, lab_id_number, PAT.patient_code,PAT.full_name,\
        PAT.date_of_birth, PAT.gender, SP.sample_id,SP.collected,\
        SP.collected_by, SP.collected_date,SP.hims_d_lab_sample_id,SP.status as sample_status from ((hims_f_lab_order SA inner join hims_f_patient PAT ON \
        SA.patient_id=PAT.hims_d_patient_id) inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id) \
        left outer join hims_f_lab_sample SP on SA.hims_f_lab_order_id = SP.order_id WHERE SA.record_status='A' AND " +
          whereOrder +
          (where.condition == "" ? "" : " AND " + where.condition),
        where.values,

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

let insertLadOrderedServices = (req, res, next) => {
  const insurtColumns = [
    "patient_id",
    "visit_id",
    "provider_id",
    "service_id",
    "billed",
    "ordered_date"
  ];

  const labServices = new LINQ(req.body.billdetails)
    .Where(
      w =>
        w.service_type_id == appsettings.hims_d_service_type.service_type_id.Lab
    )
    .Select(s => {
      return {
        patient_id: req.body.patient_id,
        provider_id: req.body.incharge_or_provider,
        visit_id: req.body.visit_id,
        service_id: s.services_id,
        billed: "Y",
        ordered_date: s.ordered_date
      };
    })
    .ToArray();

  debugLog("labServices: ", labServices);
  if (labServices.length > 0) {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      debugLog("insurtColumns", insurtColumns.join(","));
      debugLog("labServices", labServices);
      connection.query(
        "INSERT INTO hims_f_lab_order(" +
          insurtColumns.join(",") +
          ",created_by,updated_by)  VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: labServices,
            req: req,
            newFieldToInsert: [
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.algaeh_d_app_user_id
            ]
          })
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          const get_services_id = new LINQ(labServices)
            .Select(s => {
              return s.service_id;
            })
            .ToArray();
          connection.query(
            "select  hims_d_investigation_test_id from hims_d_investigation_test where record_status='A' and services_id in (?)",
            [get_services_id.join(",")],
            (error, rec) => {
              if (error) {
                releaseDBConnection(db, connection);
                next(error);
              }
              const test_id = new LINQ(rec)
                .Select(s => {
                  return s.hims_d_investigation_test_id;
                })
                .ToArray();
              connection.query(
                "select services_id,specimen_id FROM  hims_m_lab_specimen,hims_d_investigation_test where \
                  hims_d_investigation_test_id=hims_m_lab_specimen.test_id and hims_m_lab_specimen.record_status='A' and test_id in (?); \
                  select hims_f_lab_order_id,service_id from hims_f_lab_order where record_status='A' and visit_id =? and service_id in (?); \
                  select hims_d_investigation_test.services_id,analyte_type,result_unit,analyte_id \
                  from hims_d_investigation_test,hims_m_lab_analyte where \
                 hims_d_investigation_test_id=hims_m_lab_analyte.test_id and hims_m_lab_analyte.record_status='A' \
                 and hims_m_lab_analyte.test_id in  (?);",
                [
                  test_id.join(","),
                  req.body.visit_id,
                  get_services_id.join(","),
                  test_id.join(",")
                ],
                (error, specimentRecords) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }
                  const insertedLabSample = new LINQ(specimentRecords[0])
                    .Select(s => {
                      return {
                        order_id: new LINQ(specimentRecords[1])
                          .Where(w => w.service_id == s.services_id)
                          .FirstOrDefault().hims_f_lab_order_id,
                        sample_id: s.specimen_id
                      };
                    })
                    .ToArray();
                  debugLog("insertedLabSample", insertedLabSample);
                  const sample = ["order_id", "sample_id"];
                  connection.query(
                    "insert into hims_f_lab_sample(" +
                      sample.join(",") +
                      ",created_by,updated_by) VALUES ?",
                    [
                      jsonArrayToObject({
                        sampleInputObject: sample,
                        arrayObj: insertedLabSample,
                        req: req,
                        newFieldToInsert: [
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.algaeh_d_app_user_id
                        ]
                      })
                    ],
                    (error, recordInserted) => {
                      if (error) {
                        releaseDBConnection(db, connection);
                        next(error);
                      }
                      const analyts = [
                        "order_id",
                        "analyte_id",
                        "analyte_type",
                        "result_unit"
                      ];
                      const labAnalytes = new LINQ(specimentRecords[2])
                        .Select(s => {
                          return {
                            analyte_id: s.analyte_id,
                            order_id: new LINQ(specimentRecords[1])
                              .Where(w => w.service_id == s.services_id)
                              .FirstOrDefault().hims_f_lab_order_id,
                            analyte_type: s.analyte_type,
                            result_unit: s.result_unit
                          };
                        })
                        .ToArray();
                      connection.query(
                        "insert into hims_f_ord_analytes(" +
                          analyts.join(",") +
                          ",created_by,updated_by) VALUES ?",
                        [
                          jsonArrayToObject({
                            sampleInputObject: analyts,
                            arrayObj: labAnalytes,
                            req: req,
                            newFieldToInsert: [
                              req.userIdentity.algaeh_d_app_user_id,
                              req.userIdentity.algaeh_d_app_user_id
                            ]
                          })
                        ],
                        (error, recordLabAnaytes) => {
                          releaseDBConnection(db, connection);
                          if (error) {
                            next(error);
                          }
                          req.records = result;
                          next();
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } else {
    next();
  }
};

let updateLabOrderServices = (req, res, next) => {
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

      return new Promise((resolve, reject) => {
        connection.query(
          "UPDATE hims_f_lab_sample SET `collected`=?,`collected_by`=?,\
`collected_date` =now() WHERE hims_d_lab_sample_id=?;\
SELECT distinct container_id,container_code FROM hims_m_lab_specimen,hims_d_investigation_test \
where hims_d_investigation_test.hims_d_investigation_test_id =hims_m_lab_specimen.test_id \
and hims_d_investigation_test.services_id=?;\
SELECT lab_location_code from hims_d_hospital where hims_d_hospital_id=?",
          [
            req.body.collected,
            req.userIdentity.algaeh_d_app_user_id,
            req.body.hims_d_lab_sample_id,
            req.body.service_id,
            req.body.hims_d_hospital_id
          ],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              // debugLog("Result: ", result);
              req.body.container_id = result[1][0].container_id;
              req.body.container_code = result[1][0].container_code;
              req.body.lab_location_code = result[2][0].lab_location_code;
              resolve(result);
            }
          }
        );
      })
        .then(result => {
          if (result != null) {
            const _date = new Date();
            return new Promise((resolve, reject) => {
              connection.query(
                "select number,hims_m_hospital_container_mapping_id from hims_m_hospital_container_mapping \
               where hospital_id =? and container_id=? and date =?",
                [req.body.hims_d_hospital_id, req.body.container_id, _date],
                (error, records) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(records);
                  }
                }
              );
            }).then(record => {
              let query = "";
              let condition = [];
              let padNum = "";
              let _newNumber = 1;
              if (record != null && record.length > 0) {
                _newNumber = parseInt(record[1][0].number);
                _newNumber = _newNumber + 1;
                padNum = pad(String(_newNumber), 3, "LEFT", "0");
                condition = [
                  _newNumber,
                  record.hims_m_hospital_container_mapping_id,
                  req.userIdentity.algaeh_d_app_user_id
                ];
                query =
                  "Update hims_m_hospital_container_mapping set number =?,updated_by=?,updated_date=now() where hims_m_hospital_container_mapping_id =?";
              } else {
                condition = [
                  [
                    req.body.hims_d_hospital_id,
                    req.body.container_id,
                    _date,
                    1,
                    req.userIdentity.algaeh_d_app_user_id,
                    req.userIdentity.algaeh_d_app_user_id
                  ]
                ];

                query =
                  "insert into hims_m_hospital_container_mapping (`hospital_id`,`container_id`,`date`,`number`,`created_by`,`updated_by`) values (?)";
              }

              padNum = pad(String(_newNumber), 3, "LEFT", "0");
              debugLog("padNum: ", padNum);
              const dayOfYear = moment().dayOfYear();
              debugLog("dayOfYear: ", dayOfYear);
              const labIdNumber =
                req.body.lab_location_code +
                moment().format("YY") +
                dayOfYear +
                req.body.container_code +
                padNum;

              debugLog("condition: ", condition);
              connection.query(
                query +
                  ";update hims_f_lab_order set lab_id_number ='" +
                  labIdNumber +
                  "' where hims_f_lab_order_id=" +
                  req.body.hims_f_lab_order_id,
                condition,
                (error, returns) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  } else {
                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      req.records = {
                        collected: req.body.collected,
                        collected_by: req.userIdentity.algaeh_d_app_user_id,
                        collected_date: new Date()
                      };
                      next();
                    });
                  }
                }
              );
            });
          }
        })
        .catch(error => {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        });
    });
  });
};

//created by nowshad: to get selected test analytes
let getTestAnalytes = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(req.query);

    debugLog("where conditn:", where);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT * from hims_f_ord_analytes where record_status='A' AND" +
          where.condition,
        where.values,

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

//created by irfan: to update Lab Sample Status updateLabSampleStatus
let updateLabSampleStatus = (req, res, next) => {
  try {
    debugFunction("updateLabSampleStatus");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);
    let input = extend({}, req.body);
    let collected = ",";
    if (req.body.status == "R") {
      collected = ", collected='N' ,";
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
        let queryBuilder =
          "update hims_f_lab_sample set `status`=?" +
          collected +
          "updated_date=?,updated_by=? where hims_d_lab_sample_id=?;";

        debugLog("queryBuilder: ", queryBuilder);
        let inputs = [
          input.status,
          new Date(),
          input.updated_by,
          input.hims_d_lab_sample_id
        ];

        connection.query(queryBuilder, inputs, (error, results) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          if (req.body.status == "R") {
            connection.query(
              "UPDATE `hims_f_lab_order` SET `status`='O',updated_date=?,updated_by=?  WHERE `hims_f_lab_order_id`=?;",
              [new Date(), input.updated_by, input.order_id],
              (error, result) => {
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
                  req.records = result;
                  next();
                });
              }
            );
          } else {
            connection.commit(error => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              req.records = results;
              next();
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update Lab Result Entry
let updateLabResultEntry = (req, res, next) => {
  debugFunction("updateLabResultEntry");
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
        let user_id = extend({}, req.body);
        let inputParam = extend([], req.body);
        debugLog("ff:", user_id.updated_by);
        debugLog("inputParam:", inputParam);

        let status_C = new LINQ(inputParam)
          .Where(w => w.status == "C")
          .ToArray().length;
        let status_V = new LINQ(inputParam)
          .Where(w => w.status == "V")
          .ToArray().length;

        let ref = null;

        switch (inputParam.length) {
          case status_C:
            //Do functionality for C here
            ref = "CF";
            break;

          case status_V:
            //Do functionality for V here
            ref = "V";
            break;
          default:
            ref = null;
        }

        let todayDate = new Date();

        debugLog("ref:", ref);

        let qry = "";

        for (let i = 0; i < req.body.length; i++) {
          qry +=
            " UPDATE `hims_f_ord_analytes` SET result='" +
            inputParam[i].result +
            "',`status`='" +
            inputParam[i].status +
            "',entered_by='" +
            user_id.updated_by +
            "',entered_date='" +
            new Date().toLocaleString() +
            "',validate_by='" +
            user_id.updated_by +
            "',validated_date='" +
            new Date().toLocaleString() +
            "',confirm_by='" +
            user_id.updated_by +
            "',confirmed_date='" +
            new Date().toLocaleString() +
            "',updated_date='" +
            new Date().toLocaleString() +
            "',updated_by='" +
            user_id.updated_by +
            "' WHERE order_id='" +
            inputParam[i].order_id +
            "'AND hims_f_ord_analytes_id='" +
            inputParam[i].hims_f_ord_analytes_id +
            "';";
        }

        connection.query(qry, (error, results) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          if (results != null && ref != null) {
            connection.query(
              "update hims_f_lab_order set `status`='" +
                ref +
                "',updated_date= '" +
                new Date().toLocaleString() +
                "',updated_by='" +
                user_id.updated_by +
                "' where hims_f_lab_order_id=? ",
              [inputParam[0].order_id],
              (error, result) => {
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
                  req.records = result;
                  next();
                });
              }
            );
          } else {
            connection.commit(error => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              req.records = results;
              next();
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getLabOrderedServices,
  getTestAnalytes,
  insertLadOrderedServices,
  updateLabOrderServices,
  updateLabSampleStatus,
  updateLabResultEntry
};
