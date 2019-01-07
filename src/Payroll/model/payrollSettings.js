"use strict";
import extend from "extend";
import {
  selectStatement,
  whereCondition,
  deleteRecord,
  runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
//import { LINQ } from "node-linq";

import { debugLog } from "../../utils/logging";

let getMiscEarningDeductions = (req, res, next) => {
  let selectWhere = {
    component_category: "ALL",
    miscellaneous_component: "ALL",
    component_type: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_earning_deduction_id,earning_deduction_code,earning_deduction_description,\
          short_desc,component_category,calculation_method,component_frequency,calculation_type,\
          component_type,shortage_deduction_applicable,overtime_applicable,limit_applicable,limit_amount,\
          process_limit_required,process_limit_days,general_ledger,allow_round_off,round_off_type,\
          round_off_amount from hims_d_earning_deduction\
          where record_status='A' and " +
          where.condition +
          "order by hims_d_earning_deduction_id desc",
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
  getMiscEarningDeductions
};
