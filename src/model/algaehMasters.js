"use strict";
import extend from "extend";
import {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
//import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";

//created by irfan: to add AlgaehGroupMAster
let addAlgaehGroupMAster = (req, res, next) => {
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
        "INSERT INTO `algaeh_d_app_group` (app_group_code, app_group_name, app_group_desc, group_type,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)",
        [
          input.app_group_code,
          input.app_group_name,
          input.app_group_desc,
          input.group_type,

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

module.exports = { addAlgaehGroupMAster };
