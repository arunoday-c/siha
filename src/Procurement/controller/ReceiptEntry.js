import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addReceiptEntry,
  getReceiptEntry,
  updateReceiptEntry,
  getAuthPurchaseList
} from "../model/ReceiptEntry";
import { debugFunction, debugLog } from "../../utils/logging";
export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post(
    "/addReceiptEntry",
    generateDbConnection,
    addReceiptEntry,
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

  // created by Nowshad :to getAuthrequisitionList
  api.get(
    "/getAuthPurchaseList",
    getAuthPurchaseList,
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
    updateReceiptEntry,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  return api;
};
