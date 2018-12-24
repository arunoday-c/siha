"use strict";
import extend from "extend";
import {
  selectStatement,
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";

import { debugLog } from "../../utils/logging";

//created by irfan: to
let get = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_employee_id, employee_code,full_name  as employee_name,\
employee_status,date_of_joining ,date_of_leaving from hims_d_employee where employee_status <>'I'\
and (( date_of_joining <= '2018-12-31' and date_of_leaving >= '2018-12-01') or \
(date_of_joining <= '2018-12-31' and date_of_leaving is null))",
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

module.exports = {};
