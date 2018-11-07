"use strict";
import extend from "extend";
import {
  
  releaseDBConnection,whereCondition
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
          hims_d_counter where record_status='A' order by hims_d_counter_id desc;",
         
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
  let selectWhere = {
    hims_d_shift_id: "ALL"
  };
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }
      let db = req.db;
  
      let where = whereCondition(extend(selectWhere, req.query));
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_shift_id, shift_code, shift_description, arabic_name, shift_status from \
          hims_d_shift where record_status='A' "+          
          where.condition+" order by hims_d_shift_id desc",
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


    //created by irfan: to 
let getCashiers = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_employee_id, employee_code,full_name as cashier_name, is_cashier ,user_id as cashier_id\
        from hims_d_employee E ,hims_m_employee_department_mappings EDM where E.record_status='A' and \
        EDM.record_status='A' and   is_cashier='Y'\
        and E.hims_d_employee_id=EDM.employee_id order by hims_d_employee_id desc;",
       
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


//created by irfan: to 
let addCashierToShift = (req, res, next) => {
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
        "INSERT INTO `hims_m_cashier_shift` (cashier_id, shift_id, year,month,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?)",
        [
          input.cashier_id,
          input.shift_id,
          input.year,   
          input.month,        
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


    //created by irfan: to 
    let getCashiersAndShiftMAP = (req, res, next) => {
      try {
        if (req.db == null) {
          next(httpStatus.dataBaseNotInitilizedError());
        }
        let db = req.db;
    
        
        db.getConnection((error, connection) => {
          connection.query(
            "select hims_m_cashier_shift_id, cashier_id, shift_id,shift_description, year, month,\
            hims_d_employee_department_id,EDM.employee_id,E.full_name as cashier_name\
            from hims_m_cashier_shift CS,hims_d_shift S,hims_d_employee E ,hims_m_employee_department_mappings EDM\
              where CS.record_status='A' and S.record_status='A' and CS.shift_id=S.hims_d_shift_id \
              and CS.cashier_id=EDM.user_id  and EDM.employee_id=E.hims_d_employee_id\
              order by hims_m_cashier_shift_id desc;",
           
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
    addShiftMaster,
    addCounterMaster,
    getCounterMaster,
    getShiftMaster,
    updateShiftMaster,
    updateCounterMaster,
    getCashiers,
    addCashierToShift,
    getCashiersAndShiftMAP
  };