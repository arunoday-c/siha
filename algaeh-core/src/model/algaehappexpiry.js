"use strict";

import moment from "moment";
import logUtils from "../utils/logging";

import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const { debugLog } = logUtils;

//created by Nowshad: to Add Expiry off an App
let addAppExxpiry = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let app_status = "A";
    let start_date = moment(new Date()).format("YYYY-MM-DD");
    let end_date = moment(new Date())
      .add(30, "days")
      .format("YYYY-MM-DD");
    debugLog("end_date: ", end_date);
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `algaeh_d_app_expiry` (start_date, end_date, app_status)\
        VALUE(?, ?, ?)",
        values: [start_date, end_date, app_status]
        // printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by Nowshad: to App Expiry Details
let getAppExxpiry = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "select algaeh_d_app_expiry_id, start_date, end_date, app_status FROM algaeh_d_app_expiry;"
        // printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  addAppExxpiry,
  getAppExxpiry
};
