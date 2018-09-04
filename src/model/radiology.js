"use strict";
import extend from "extend";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";

import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import appsettings from "../utils/appsettings.json";
import { logger, debugFunction, debugLog } from "../utils/logging";

//created by nowshad: to get lad orders for sample collection
let getRadOrderedServices = (req, res, next) => {
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

    delete req.query.from_date;
    delete req.query.to_date;
    let where = whereCondition(req.query);

    debugLog("where Dates:", whereOrder);
    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT hims_f_rad_order_id,patient_id,visit_id,provider_id, service_id,SR.service_code,SR.service_name,\
        status, cancelled, ordered_by, ordered_date, test_type, scheduled_date_time,scheduled_by,arrived_date,arrived,validate_by,\
        validate_date_time,attended_by,attended_date_time,exam_start_date_time,exam_end_date_time,exam_status,report_type,\
        PAT.patient_code,PAT.full_name,PAT.date_of_birth,PAT.gender\
        from ((hims_f_rad_order SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) inner join \
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

let insertRadOrderedServices = (req, res, next) => {
  const insurtColumns = [
    "patient_id",
    "visit_id",
    "provider_id",
    "service_id",
    "billed",
    "ordered_date",
    "ordered_by"
  ];

  const radServices = new LINQ(req.body.billdetails)
    .Where(
      w =>
        w.service_type_id ==
        appsettings.hims_d_service_type.service_type_id.Radiology
    )
    .Select(s => {
      return {
        patient_id: req.body.patient_id,
        provider_id: req.body.incharge_or_provider,
        visit_id: req.body.visit_id,
        service_id: s.services_id,
        billed: "Y",
        ordered_date: s.ordered_date,
        ordered_by: req.body.incharge_or_provider
      };
    })
    .ToArray();
  debugLog("radServices: ", radServices);

  if (radServices.length > 0) {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      debugLog("insurtColumns", insurtColumns.join(","));
      debugLog("radServices", radServices);
      connection.query(
        "INSERT INTO hims_f_rad_order(" +
          insurtColumns.join(",") +
          ",created_by,updated_by)  VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: radServices,
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
          req.records = result;
          next();
        }
      );
    });
  } else {
    next();
  }
};

let updateRadOrderedServices = (req, res, next) => {
  let RadList = {
    hims_f_rad_order_id: null,
    status: null,
    cancelled: null,
    scheduled_date_time: null,
    scheduled_by: null,
    arrived_date: null,
    arrived: null,
    validate_by: null,
    validate_date_time: null,
    attended_by: null,
    attended_date_time: null,
    exam_start_date_time: null,
    exam_end_date_time: null,
    exam_status: null,
    report_type: null
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }

  //req.userIdentity.algaeh_d_app_user_id
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(RadList, req.body);

    if (inputParam.scheduled_by == null && inputParam.status == "S") {
      inputParam.scheduled_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (inputParam.validate_by == null && inputParam.status == "V") {
      inputParam.validate_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (
      inputParam.attended_by == null &&
      inputParam.status == "V" &&
      inputParam.report_type == "AD"
    ) {
      inputParam.attended_by = req.userIdentity.algaeh_d_app_user_id;
    }

    connection.query(
      "UPDATE `hims_f_rad_order` \
     SET `status`=?,  `cancelled`=?,`scheduled_date_time`=?, `scheduled_by`=?, `arrived_date`=?,`arrived`=?,\
     `validate_by`=?, `validate_date_time` = ?, `attended_by`=?,`attended_date_time`=?,`exam_start_date_time`=?, \
     `exam_end_date_time`=?, `exam_status`=?, `report_type`=?\
     WHERE `record_status`='A' and `hims_f_rad_order_id`=?",
      [
        inputParam.status,
        inputParam.cancelled,
        inputParam.scheduled_date_time,
        inputParam.scheduled_by,
        inputParam.arrived,
        inputParam.arrived_date,
        inputParam.validate_by,
        inputParam.validate_date_time,
        inputParam.attended_by,
        inputParam.attended_date_time,
        inputParam.exam_start_date_time,
        inputParam.exam_end_date_time,
        inputParam.exam_status,
        inputParam.report_type,
        inputParam.hims_f_rad_order_id
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
};

module.exports = {
  getRadOrderedServices,
  insertRadOrderedServices,
  updateRadOrderedServices
};
