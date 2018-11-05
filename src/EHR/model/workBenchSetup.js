"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
//import { LINQ } from "node-linq";
// import moment from "moment";
 import { debugFunction, debugLog } from "../../utils/logging";
// import formater from "../../keys/keys";
// import { decryption } from "../../utils/cryptography";


//created by irfan: to add vital header
let addVitalMasterHeader = (req, res, next) => {
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
          "INSERT INTO `hims_d_vitals_header` (vitals_name, uom,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?)",
          [
            input.vitals_name,
            input.uom,
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


  //created by irfan: to getVitalMasterHeader
let getVitalMasterHeader = (req, res, next) => {
    let selectWhere = {
      hims_d_vitals_header_id: "ALL"
    };
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }
      let db = req.db;
  
      let where = whereCondition(extend(selectWhere, req.query));
  
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_vitals_header_id, vitals_name FROM hims_d_vitals_header where record_status='A' AND" +
            where.condition+" order by hims_d_vitals_header_id desc",
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

//created by irfan: to add vital detail
let addVitalMasterDetail = (req, res, next) => {
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
          "INSERT INTO `hims_d_vitals_details` (vitals_header_id, gender, min_age, max_age, min_value, max_value, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?)",
          [
            input.vitals_header_id,
            input.gender,
            input.min_age,
            input.max_age,
            input.min_value,
            input.max_value,
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


//created by irfan: to getVitalMasterHeader
let getVitalMasterDetail = (req, res, next) => {
  let selectWhere = {
    vitals_header_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_vitals_details_id, vitals_header_id, gender, min_age, max_age, min_value, max_value FROM hims_d_vitals_details where record_status='A' AND" +
          where.condition+" order by vitals_header_id desc",
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
    addVitalMasterHeader,
    addVitalMasterDetail,
    getVitalMasterHeader,
    getVitalMasterDetail
}