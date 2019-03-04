"use strict";

import { releaseDBConnection } from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { debugLog } from "../utils/logging";

//created by Nowshad: to Add Expiry off an App
let addAppExxpiry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let app_status = "A";
      let start_date = moment(new Date()).format("YYYY-MM-DD");
      let end_date = moment(new Date())
        .add(30, "days")
        .format("YYYY-MM-DD");
      debugLog("end_date: ", end_date);

      connection.query(
        "INSERT INTO `algaeh_d_app_expiry` (start_date, end_date, app_status)\
          VALUE(?, ?, ?)",
        [start_date, end_date, app_status],
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

//created by Nowshad: to App Expiry Details
let getAppExxpiry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "select algaeh_d_app_expiry_id, start_date, end_date, app_status FROM algaeh_d_app_expiry;",
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
  addAppExxpiry,
  getAppExxpiry
};
