"use strict";
import extend from "extend";
import { whereCondition, releaseDBConnection } from "../utils";

import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";

import { logger, debugFunction, debugLog } from "../utils/logging";

//created by nowshad: to get lad orders for sample collection
let getLabOrderedServices = (req, res, next) => {
  let preAprovalWhere = {
    patient_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    req.query["date(ordered_date)"] = req.query.ordered_date;
    // delete req.query.ordered_date;

    debugLog("req query:", req.query);

    let where = whereCondition(extend(preAprovalWhere, req.query));

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

module.exports = {
  getLabOrderedServices
};
