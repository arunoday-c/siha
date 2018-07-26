"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  releaseDBConnection
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
//import { LINQ } from "node-linq";

import { logger, debugFunction, debugLog } from "../../utils/logging";

//code

//created by irfan:  to add ICD
let addIcd = (req, res, next) => {
  let addIcdModel = {
    hims_d_icd_id: null,
    icd_code: null,
    icd_description: null,
    long_icd_description: null,
    icd_level: null,
    icd_type: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addIcd");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(addIcdModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_icd(\
            icd_code,icd_description,long_icd_description,icd_level,icd_type,created_by,updated_by)values(\
                ?,?,?,?,?,?,?)",
        [
          input.icd_code,
          input.icd_description,
          input.long_icd_description,
          input.icd_level,
          input.icd_type,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { addIcd };
