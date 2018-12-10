import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addDeliveryNoteEntry,
  getDeliveryNoteEntry,
  updateDeliveryNoteEntry,
  getAuthPurchaseList,
  updatePOEntry
} from "../model/DeliveryNoteEntry";
import { debugFunction, debugLog } from "../../utils/logging";
export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post(
    "/addDeliveryNoteEntry",
    generateDbConnection,
    addDeliveryNoteEntry,
    updatePOEntry,
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

  // created by Nowshad :to getDeliveryNoteEntry
  api.get(
    "/getDeliveryNoteEntry",
    getDeliveryNoteEntry,
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
    "/updateDeliveryNoteEntry",
    updateDeliveryNoteEntry,
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
