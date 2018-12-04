"use strict";
import extend from "extend";
import {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";

//created by irfan:
let addTreatmentPlan = (req, res, next) => {
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

      connection.query(
        "INSERT INTO `hims_f_treatment_plan` (plan_name,patient_id,episode_id,visit_id,remarks,consult_date,       created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?)",
        [
          input.plan_name,
          input.patient_id,
          input.episode_id,
          input.visit_id,
          input.remarks,

          input.consult_date,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
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

//created by irfan: to
let addDentalTreatment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    //let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      const insurtColumns = [
        "patient_id",
        "episode_id",
        "treatment_plan_id",
        "service_id",
        "teeth_number",
        "scheduled_date",
        "distal",
        "incisal",
        "occlusal",
        "mesial",
        "buccal",
        "labial",
        "cervical",
        "palatal",
        "lingual",
        "billed",
        "treatment_status",
        "created_by",
        "updated_by"
      ];

      connection.query(
        "INSERT INTO hims_f_dental_treatment(" +
          insurtColumns.join(",") +
          ",created_date,updated_date) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [new Date(), new Date()],
            req: req
          })
        ],
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

//created by irfan: to
let getTreatmentPlan = (req, res, next) => {
  let selectWhere = {
    patient_id: "ALL",
    episode_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_treatment_plan_id, plan_name, patient_id, episode_id, visit_id, remarks,\
         approve_status, consult_date from  hims_f_treatment_plan where record_status='A' and " +
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
module.exports = { addTreatmentPlan, addDentalTreatment, getTreatmentPlan };
