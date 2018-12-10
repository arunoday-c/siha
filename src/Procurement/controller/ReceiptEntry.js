import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addReceiptEntry,
  getReceiptEntry,
  updateReceiptEntry,
  updateDNEntry
} from "../model/ReceiptEntry";
import { debugFunction, debugLog } from "../../utils/logging";
import { updateIntoItemLocation } from "../../Pharmacy/model/commonFunction";
import { updateIntoInvItemLocation } from "../../Inventory/model/commonFunction";

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post(
    "/addReceiptEntry",
    generateDbConnection,
    addReceiptEntry,
    updateDNEntry,
    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        if (error) {
          debugLog("Contorller: ", error);
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        } else {
          let result = req.records;
          debugLog("result: ", result);
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
          next();
        }
      });
    },
    releaseConnection
  );

  // created by Nowshad :to getReceiptEntry
  api.get(
    "/getReceiptEntry",
    getReceiptEntry,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :update Item Storage
  api.put(
    "/updateReceiptEntry",
    generateDbConnection,
    updateReceiptEntry,
    (req, res, next) => {
      debugLog("phr.req.body", req.body);
      if (req.body.grn_for == "PHR") {
        updateIntoItemLocation(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      debugLog("inv.req.body", req.body);
      if (req.body.grn_for == "INV") {
        debugLog("Data Exist: ", "Yes");
        updateIntoInvItemLocation(req, res, next);
      } else {
        next();
      }
    },

    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        if (error) {
          debugLog("Contorller: ", error);
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        } else {
          let result = req.records;
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
          next();
        }
      });
      // let results = req.records;
      // res.status(httpStatus.ok).json({
      //   success: true,
      //   records: results
      // });
      // next();
    },
    releaseConnection
  );

  return api;
};
