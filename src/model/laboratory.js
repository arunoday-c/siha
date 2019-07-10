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
import { debugFunction, debugLog } from "../utils/logging";
import Promise from "bluebird";
import moment from "moment";
import extend from "extend";
import mysql from "mysql";
//created by nowshad: to get lad orders for sample collection
let getLabOrderedServices = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let whereOrder = "";
    if (req.query.from_date != undefined) {
      whereOrder =
        "date(ordered_date) between date('" +
        req.query.from_date +
        "') AND date('" +
        req.query.to_date +
        "')";
    } else {
      whereOrder = "date(ordered_date) <= date(now())";
    }

    if (req.query.patient_id != undefined && req.query.patient_id != "null") {
      req.query["LO.patient_id"] = req.query.patient_id;
    }

    if (req.query.status != undefined && req.query.status != "null") {
      req.query["LO.status"] = req.query.status;
    }

    delete req.query.from_date;
    delete req.query.to_date;
    delete req.query.patient_id;
    delete req.query.status;
    debugLog("req.query: ", req.query);
    debugLog("whereOrder: ", whereOrder);

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
      let queryCondition = mysql.format(
        " select hims_f_lab_order_id,LO.patient_id, entered_by, confirmed_by, validated_by,visit_id,V.visit_code, provider_id, concat(T.title, ' ', E.full_name) as doctor_name, billed, service_id,S.service_code,S.service_name,LO.status,\
      cancelled, provider_id, ordered_date, test_type, lab_id_number, run_type, P.patient_code,P.full_name,P.date_of_birth, P.gender,\
      LS.sample_id,LS.collected,LS.collected_by, LS.remarks,LS.collected_date,LS.hims_d_lab_sample_id,LS.status as sample_status\
      from hims_f_lab_order LO inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
      inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id and  V.record_status='A'\
      inner join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
      inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
      left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A' \
      left join hims_d_title as T on T.his_d_title_id = E.title_id   WHERE " +
          whereOrder +
          (where.condition == ""
            ? "" + " order by hims_f_lab_order_id desc"
            : " AND " + where.condition),
        where.values
      );
     
      db.query(
        queryCondition,

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
    "ordered_services_id",
    "patient_id",
    "visit_id",
    "provider_id",
    "service_id",
    "billed",
    "ordered_date",
    "test_type"
  ];
  // "ordered_date"
  debugLog("req: ", req.records);
  // const Services = req.body || req.body.billdetails;

  // debugLog("Services ", Services);

  debugLog("req Body: ", req.body.billdetails);
  debugLog("ResultOfFetchOrderIds: ", req.records.ResultOfFetchOrderIds);

  let Services =
    req.records.ResultOfFetchOrderIds == null
      ? req.body.billdetails
      : req.records.ResultOfFetchOrderIds;
  debugLog("Services: ", Services);

  const labServices = [
    ...new Set(
      new LINQ(Services)
        .Where(
          w =>
            w.service_type_id ==
            appsettings.hims_d_service_type.service_type_id.Lab
        )
        .Select(s => {
          return {
            ordered_services_id: s.hims_f_ordered_services_id || null,
            patient_id: req.body.patient_id,
            provider_id: req.body.incharge_or_provider,
            visit_id: req.body.visit_id,
            service_id: s.services_id,
            billed: req.body.billed,
            ordered_date: s.created_date,
            test_type: s.test_type
          };
        })
        .ToArray()
    )
  ];

  let connection = req.connection;

  debugLog("labServices: ", labServices);
  if (labServices.length > 0) {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("insurtColumns", insurtColumns.join(","));
    debugLog("labServices", labServices);
    connection.query(
      "INSERT INTO hims_f_lab_order(" +
        insurtColumns.join(",") +
        ",created_by,updated_by,hospital_id)  VALUES ?",
      [
        jsonArrayToObject({
          sampleInputObject: insurtColumns,
          arrayObj: labServices,
          req: req,
          newFieldToInsert: [
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity["x-branch"]
          ]
        })
      ],
      (error, result) => {
        debugLog("result Order: ", result);
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }
        const get_services_id = new LINQ(labServices)
          .Select(s => {
            return s.service_id;
          })
          .ToArray();
        debugLog("Services ME : ", get_services_id);
        debugLog("Array ME", get_services_id.join(","));
        connection.query(
          "select  hims_d_investigation_test_id from hims_d_investigation_test where record_status='A' and services_id in (?)",
          [get_services_id],
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

            debugLog("test_id", test_id.join(","));
            debugLog("visit_id", req.body.visit_id);

            connection.query(
              "select services_id,specimen_id FROM  hims_m_lab_specimen,hims_d_investigation_test where \
                  hims_d_investigation_test_id=hims_m_lab_specimen.test_id and hims_m_lab_specimen.record_status='A' and test_id in (?); \
                  select hims_f_lab_order_id,service_id from hims_f_lab_order where record_status='A' and visit_id =? and service_id in (?); \
                  select hims_d_investigation_test.services_id,analyte_type,result_unit,analyte_id,critical_low,critical_high, \
                  normal_low,normal_high \
                  from hims_d_investigation_test,hims_m_lab_analyte where \
                 hims_d_investigation_test_id=hims_m_lab_analyte.test_id and hims_m_lab_analyte.record_status='A' \
                 and hims_m_lab_analyte.test_id in  (?);",
              [test_id, req.body.visit_id, get_services_id, test_id],
              (error, specimentRecords) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                if (
                  specimentRecords[0] == null ||
                  specimentRecords[0].length == 0
                ) {
                  releaseDBConnection(db, connection);
                  connection.rollback(() => {
                    next(
                      httpStatus.generateError(
                        httpStatus.forbidden,
                        "No specimen avilable"
                      )
                    );
                  });
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
                      "result_unit",
                      "critical_low",
                      "critical_high",
                      "normal_low",
                      "normal_high"
                    ];
                    if (
                      specimentRecords[2] != null &&
                      specimentRecords[2].length != 0
                    ) {
                      const labAnalytes = new LINQ(specimentRecords[2])
                        .Select(s => {
                          return {
                            analyte_id: s.analyte_id,
                            order_id: new LINQ(specimentRecords[1])
                              .Where(w => w.service_id == s.services_id)
                              .FirstOrDefault().hims_f_lab_order_id,
                            analyte_type: s.analyte_type,
                            result_unit: s.result_unit,
                            critical_low: s.critical_low,
                            critical_high: s.critical_high,
                            normal_low: s.normal_low,
                            normal_high: s.normal_high
                          };
                        })
                        .ToArray();

                      debugLog("labAnalytes: ", labAnalytes);
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
                          req.records = {
                            result,
                            ResultOfFetchOrderIds:
                              req.records.ResultOfFetchOrderIds
                          };
                          next();
                        }
                      );
                    } else {
                      next();
                    }
                  }
                );
              }
            );
          }
        );
      }
    );
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
          "UPDATE hims_f_lab_sample SET `collected`=?,`status`=?, `collected_by`=?,\
`collected_date` =now() WHERE hims_d_lab_sample_id=?;\
SELECT distinct container_id,container_code FROM hims_m_lab_specimen,hims_d_investigation_test \
where hims_d_investigation_test.hims_d_investigation_test_id =hims_m_lab_specimen.test_id \
and hims_d_investigation_test.services_id=?;\
SELECT lab_location_code from hims_d_hospital where hims_d_hospital_id=?",
          [
            req.body.collected,
            req.body.status,
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
                _newNumber = parseInt(record[1][0].number, 10);
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
                  "',status='CL' where hims_f_lab_order_id=" +
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
                      releaseDBConnection(db, connection);
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
        "SELECT *,la.description from hims_f_ord_analytes, hims_d_lab_analytes la where hims_f_ord_analytes.record_status='A' \
        and la.hims_d_lab_analytes_id = hims_f_ord_analytes.analyte_id AND" +
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

//created by irfan: to update Lab Specimen Status updateLabSampleStatus
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
          "remarks=?,updated_date=?,updated_by=? where hims_d_lab_sample_id=?;";

        debugLog("queryBuilder: ", queryBuilder);
        let inputs = [
          input.status,
          input.remarks,
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
                  releaseDBConnection(db, connection);
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
              releaseDBConnection(db, connection);
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

        debugLog("inputParam:", inputParam);
        let amended = "";

        let status_C = new LINQ(inputParam)
          .Where(w => w.status == "C")
          .ToArray().length;
        let status_V = new LINQ(inputParam)
          .Where(w => w.status == "V")
          .ToArray().length;

        let status_N = new LINQ(inputParam)
          .Where(w => w.status == "N")
          .ToArray().length;

        let status_E = new LINQ(inputParam)
          .Where(w => w.status == "E")
          .ToArray().length;

        let runtype = new LINQ(inputParam)
          .Where(w => w.run_type != null)
          .Select(s => s.run_type)
          .ToArray();

        let ref = null;
        let entered_by = "";
        let confirmed_by = "";
        let validated_by = "";

        switch (inputParam.length - 1) {
          case status_C:
            //Do functionality for C here
            ref = "CF";
            confirmed_by = req.userIdentity.algaeh_d_app_user_id;
            break;

          case status_V:
            //Do functionality for V here
            ref = "V";
            validated_by = req.userIdentity.algaeh_d_app_user_id;
            break;

          case status_N:
            //Do functionality for CL here
            ref = "CL";
            break;

          case status_E:
            ref = "CL";
            entered_by = req.userIdentity.algaeh_d_app_user_id;
            break;
          default:
            ref = null;
        }

        debugLog("ref: ", ref);
        debugLog("entered_by: ", entered_by);
        debugLog("confirmed_by: ", confirmed_by);
        debugLog("validated_by: ", validated_by);

        let qry = "";

        for (let i = 0; i < req.body.length; i++) {
          // if (inputParam[i].amended === "Y") {
          //   amended =
          //     "',amended_by='" +
          //     user_id.updated_by +
          //     "',amended_date='" +
          //     moment().format("YYYY-MM-DD HH:mm");
          // } else {
          //   amended = "";
          // }
          qry += mysql.format(
            "UPDATE `hims_f_ord_analytes` SET result=?,\
          `status`=?,`remarks`=?,`run1`=?,`run2`=?,`run3`=?,`critical_type`=?,\
          entered_by=?,entered_date=?,validate_by=?,validated_date=?,\
          confirm_by=?,confirmed_date=?,amended=?,amended_date=?,\
          updated_date=?,updated_by=? where order_id=? AND hims_f_ord_analytes_id=?;",
            [
              inputParam[i].result,
              inputParam[i].status,
              inputParam[i].remarks,
              inputParam[i].run1,
              inputParam[i].run2,
              inputParam[i].run3,
              inputParam[i].critical_type,
              user_id.updated_by,
              moment().format("YYYY-MM-DD HH:mm"),
              inputParam[i].validate == "N" ? null : user_id.updated_by,
              inputParam[i].validate == "N"
                ? null
                : moment().format("YYYY-MM-DD HH:mm"),
              inputParam[i].confirm == "N" ? null : user_id.updated_by,
              inputParam[i].confirm == "N"
                ? null
                : moment().format("YYYY-MM-DD HH:mm"),
              inputParam[i].amended,
              inputParam[i].amended === "Y"
                ? moment().format("YYYY-MM-DD HH:mm")
                : null,
              moment().format("YYYY-MM-DD HH:mm"),
              user_id.updated_by,
              inputParam[i].order_id,
              inputParam[i].hims_f_ord_analytes_id
            ]
          );
          // qry +=
          //   " UPDATE `hims_f_ord_analytes` SET result='" +
          //   inputParam[i].result +
          //   "',`status`='" +
          //   inputParam[i].status +
          //   "',`remarks`='" +
          //   inputParam[i].remarks +
          //   "',`run1`='" +
          //   inputParam[i].run1 +
          //   "',`run2`='" +
          //   inputParam[i].run2 +
          //   "',`run3`='" +
          //   inputParam[i].run3 +
          //   "',`critical_type`='" +
          //   inputParam[i].critical_type +
          //   "',entered_by='" +
          //   user_id.updated_by +
          //   "',entered_date='" +
          //   moment().format("YYYY-MM-DD HH:mm") +
          //   "',validate_by='" +
          //   user_id.updated_by +
          //   "',validated_date='" +
          //   moment().format("YYYY-MM-DD HH:mm") +
          //   "',confirm_by='" +
          //   user_id.updated_by +
          //   "',confirmed_date='" +
          //   moment().format("YYYY-MM-DD HH:mm") +
          //   "',amended='" +
          //   inputParam[i].amended +
          //   amended +
          //   "',updated_date='" +
          //   moment().format("YYYY-MM-DD HH:mm") +
          //   "',updated_by='" +
          //   user_id.updated_by +
          //   "' WHERE order_id='" +
          //   inputParam[i].order_id +
          //   "'AND hims_f_ord_analytes_id='" +
          //   inputParam[i].hims_f_ord_analytes_id +
          //   "';";
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
                "',entered_date= '" +
                moment().format("YYYY-MM-DD HH:mm") +
                "',entered_by= '" +
                user_id.updated_by +
                "',confirmed_date= '" +
                moment().format("YYYY-MM-DD HH:mm") +
                "',confirmed_by= '" +
                user_id.updated_by +
                "',validated_date= '" +
                moment().format("YYYY-MM-DD HH:mm") +
                "',validated_by= '" +
                user_id.updated_by +
                "',updated_date= '" +
                moment().format("YYYY-MM-DD HH:mm") +
                "',run_type='" +
                runtype[0] +
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
                  releaseDBConnection(db, connection);
                  req.records = {
                    results,
                    entered_by: entered_by,
                    confirmed_by: confirmed_by,
                    validated_by: validated_by
                  };
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
              releaseDBConnection(db, connection);
              req.records = {
                results,
                entered_by: entered_by,
                confirmed_by: confirmed_by,
                validated_by: validated_by
              };
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

//lab services update as billed
let updateLabOrderedBilled = (req, res, next) => {
  debugFunction("updateLabOrderedBilled");

  debugLog("Bill Data: ", req.body.billdetails);
  let OrderServices = new LINQ(req.body.billdetails)
    .Where(
      w =>
        w.hims_f_ordered_services_id != null &&
        w.service_type_id == appsettings.hims_d_service_type.service_type_id.Lab
    )
    .Select(s => {
      return {
        ordered_services_id: s.hims_f_ordered_services_id,
        billed: "Y",
        updated_date: new Date(),
        updated_by: req.userIdentity.algaeh_d_app_user_id
      };
    })
    .ToArray();
  debugLog("Lab Order Services: ", OrderServices);
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let connection = req.connection;

    let qry = "";

    for (let i = 0; i < OrderServices.length; i++) {
      qry += mysql.format(
        "UPDATE `hims_f_lab_order` SET billed=?,\
      updated_date=?,updated_by=? where ordered_services_id=?;",
        [
          OrderServices[i].billed,
          moment().format("YYYY-MM-DD HH:mm"),
          OrderServices[i].updated_by,
          OrderServices[i].ordered_services_id
        ]
      );
      // qry +=
      //   " UPDATE `hims_f_lab_order` SET billed='" +
      //   OrderServices[i].billed +
      //   "',updated_date='" +
      //   new Date().toLocaleString() +
      //   "',updated_by='" +
      //   OrderServices[i].updated_by +
      //   "' WHERE ordered_services_id='" +
      //   OrderServices[i].ordered_services_id +
      //   "';";
    }
    debugLog("Query", qry);
    if (qry != "") {
      connection.query(qry, (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        debugLog("Query Result ", result);
        req.records = { result, LAB: false };
        next();
      });
    } else {
      req.records = { LAB: true };
      next();
    }
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
  updateLabResultEntry,
  updateLabOrderedBilled
};
