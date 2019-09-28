"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

const {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} = utils;

//created by irfan: to addCurrencyMaster
let addCurrencyMaster = (req, res, next) => {
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
        "INSERT INTO `hims_d_currency` (currency_code, currency_description, currency_symbol, decimal_places, symbol_position,\
          thousand_separator, decimal_separator, negative_separator,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.currency_code,
          input.currency_description,
          input.currency_symbol,
          input.decimal_places,
          input.symbol_position,
          input.thousand_separator,
          input.decimal_separator,
          input.negative_separator,
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

//created by irfan: to getCurrencyMaster
let getCurrencyMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_currency_id, currency_code, currency_description, currency_symbol,\
        decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator\
        FROM hims_d_currency where record_status='A' order by hims_d_currency_id desc ",
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

//created by irfan: to deleteCurrencyMaster
let deleteCurrencyMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_currency",
        id: req.body.hims_d_currency_id,
        query:
          "UPDATE hims_d_currency SET  record_status='I' WHERE hims_d_currency_id=?",
        values: [req.body.hims_d_currency_id]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  updateCurrencyMaster
let updateCurrencyMaster = (req, res, next) => {
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
        "UPDATE `hims_d_currency` SET  decimal_places=?, symbol_position=?, thousand_separator=?, decimal_separator=?, negative_separator=?,\
           updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_d_currency_id`=?;",
        [
          input.decimal_places,
          input.symbol_position,
          input.thousand_separator,
          input.decimal_separator,
          input.negative_separator,
          new Date(),
          input.updated_by,
          input.hims_d_currency_id
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
export default {
  addCurrencyMaster,
  getCurrencyMaster,
  deleteCurrencyMaster,
  updateCurrencyMaster
};
