"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import httpStatus from "../utils/httpStatus";
//import { LINQ } from "node-linq";
import moment from "moment";
import { debugFunction, debugLog } from "../utils/logging";
import formater from "../keys/keys";
import { decryption } from "../utils/cryptography";

//created by irfan: to add Patient Prescription
let addPatientPrescription = (req, res, next) => {
  // created_by: req.userIdentity.algaeh_d_app_user_id,
  // updated_by: req.userIdentity.algaeh_d_app_user_id

  debugFunction("addPatientPrescription");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

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

        connection.query(
          "INSERT INTO `hims_f_prescription` (`patient_id`, `encounter_id`, `provider_id`, `episode_id`, `prescription_date`, `created_by`, `created_date`, `updated_by`, `updated_date`) values(\
            ?,?,?,?,?,?,?,?,?)",
          [
            input.patient_id,
            input.encounter_id,
            input.provider_id,
            input.episode_id,
            new Date(),
            input.created_by,
            new Date(),
            input.updated_by,
            new Date()
          ],
          (error, results) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            // debugLog("Results are recorded...");

            if (results.insertId != null) {
              debugLog("  inserted id ", results.insertId);
              debugLog(" body ", req.body);
              req.body.prescription_id = results.insertId;

              const insurtColumns = [
                "item_id",
                "generic_id",
                "dosage",
                "frequency",
                "no_of_days",
                "dispense",
                "frequency_type",
                "frequency_time"
              ];

              connection.query(
                "INSERT INTO hims_f_prescription_detail(" +
                  insurtColumns.join(",") +
                  ",`prescription_id`) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.medicationitems,
                    newFieldToInsert: [req.body.prescription_id],
                    req: req
                  })
                ],
                (error, detailResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(error => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }
                    req.records = detailResult;
                    next();
                  });
                }
              );
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { addPatientPrescription };
