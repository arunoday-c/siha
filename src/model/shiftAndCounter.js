"use strict";
import extend from "extend";
import {
  
 
  releaseDBConnection
} from "../utils";

import httpStatus from "../utils/httpStatus";

import {debugLog } from "../utils/logging";


//created by irfan: to add shift master
let addShiftMaster = (req, res, next) => {
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
          "INSERT INTO `hims_d_shift` (shift_code,shift_description,arabic_name,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)",
          [
            input.shift_code,
            input.shift_description,
            input.arabic_name,        
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
//created by irfan: to addCounterMaster
let addCounterMaster = (req, res, next) => {
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
          "INSERT INTO `hims_d_counter` (counter_code,counter_description,arabic_name,     created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)",
          [
            input.counter_code,
            input.counter_description,
            input.arabic_name,      
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



  //created by irfan: to getCounterMaster
let getCounterMaster = (req, res, next) => {
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }
      let db = req.db;
  
      
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_counter_id,counter_code,counter_description,arabic_name,counter_status from \
          hims_d_counter where record_status='A';",
         
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


  //created by irfan: to getShiftMaster
let getShiftMaster = (req, res, next) => {
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }
      let db = req.db;
  
      
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_shift_id, shift_code, shift_description, arabic_name, shift_status from \
          hims_d_shift where record_status='A';",
         
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



  //created by irfan: to updateShiftMaster 
let updateShiftMaster = (req, res, next) => {
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
          "UPDATE `hims_d_shift` SET shift_code=?, shift_description=?, arabic_name=?, shift_status=?,\
             updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_shift_id`=?;",
          [
            input.shift_code,
            input.shift_description,
            input.arabic_name,
            input.shift_status,
            new Date(),
            input.updated_by,
            input.record_status,
            input.hims_d_shift_id
          ],
          (error, results) => {
            releaseDBConnection(db, connection);
            if (error) {
           
              next(error);
            }
            req.records = results;
            next();
          }
        );
      });
    } catch (e) {
      next(e);
    }
  };


  //created by irfan: to  updateCounterMaster
let updateCounterMaster = (req, res, next) => {
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
          "UPDATE `hims_d_counter` SET counter_code=?, counter_description=?, arabic_name=?, counter_status=?,\
             updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_counter_id`=?;",
          [
            input.counter_code,
            input.counter_description,
            input.arabic_name,
            input.counter_status,
            new Date(),
            input.updated_by,
            input.record_status,
            input.hims_d_counter_id
          ],
          (error, results) => {
            releaseDBConnection(db, connection);
            if (error) {
           
              next(error);
            }
            req.records = results;
            next();
          }
        );
      });
    } catch (e) {
      next(e);
    }
  };


module.exports = {
    addShiftMaster,
    addCounterMaster,
    getCounterMaster,
    getShiftMaster,
    updateShiftMaster,
    updateCounterMaster
  };