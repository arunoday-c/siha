import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import recModels from "../model/ReceiptEntry";
import logUtils from "../../utils/logging";
import comModels from "../../Pharmacy/model/commonFunction";
import invComModels from "../../Inventory/model/commonFunction";

const { updateIntoInvItemLocation } = invComModels;
const { updateIntoItemLocation } = comModels;
const { debugLog } = logUtils;
const {
  addReceiptEntry,
  getReceiptEntry,
  updateReceiptEntry,
  updateDNEntry
} = recModels;
const { releaseConnection, generateDbConnection } = utils;

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
