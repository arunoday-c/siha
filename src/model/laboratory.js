"use strict";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";

import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import appsettings from "../utils/appsettings.json";
import { logger, debugFunction, debugLog } from "../utils/logging";
import Promise from "bluebird";
//created by nowshad: to get lad orders for sample collection
let getLabOrderedServices = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let whereOrder =
      "date(ordered_date) between date('" +
      req.query.from_date +
      "') AND date('" +
      req.query.to_date +
      "')";

    delete req.query.from_date;
    delete req.query.to_date;
    let where = whereCondition(req.query);

    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT hims_f_lab_order_id,patient_id,visit_id,provider_id, service_id,SR.service_code,SR.service_name,\
        status, cancelled, ordered_date, test_type, PAT.patient_code,PAT.full_name\
        from ((hims_f_lab_order SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) inner join \
        hims_d_services SR on SR.hims_d_services_id=SA.service_id) WHERE SA.record_status='A' AND " +
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
        ordered_date: new Date()
      };
    })
    .ToArray();

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
SELECT container_code FROM hims_m_lab_specimen where hims_m_lab_specimen_id=?;",
          [
            req.userIdentity.algaeh_d_app_user_id,
            req.body.hims_d_lab_sample_id,
            req.body.hims_m_lab_specimen_id
          ],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      })
        .then(result => {
          if (result != null) {
            new Promise((resolve, reject) => {
              connection.query("");
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

module.exports = {
  getLabOrderedServices,
  insertLadOrderedServices
};
