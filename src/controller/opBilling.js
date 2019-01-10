import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import {
  addOpBIlling,
  selectBill,
  getPednigBills,
  getOpBillSummary
} from "../model/opBilling";
import { updateOrderedServicesBilled } from "../model/orderAndPreApproval";
import { debugFunction, debugLog } from "../utils/logging";
import { updateRadOrderedBilled } from "../model/radiology";
import { updateLabOrderedBilled } from "../model/laboratory";
import { insertRadOrderedServices } from "../model/radiology";
import { insertLadOrderedServices } from "../model/laboratory";
import { getReceiptEntry } from "../model/receiptentry";
import extend from "extend";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to save opBilling
  //TODO change middle ware to promisify function --added by noor
  api.post(
    "/addOpBIlling",
    generateDbConnection,
    addOpBIlling,
    updateOrderedServicesBilled,
    updateLabOrderedBilled,
    (req, res, next) => {
      if (req.records.LAB != null && req.records.LAB == true) {
        insertLadOrderedServices(req, res, next);
      } else {
        next();
      }
    },
    updateRadOrderedBilled,
    (req, res, next) => {
      if (req.records.RAD != null && req.records.RAD == true) {
        insertRadOrderedServices(req, res, next);
      } else {
        next();
      }
    },

    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        } else {
          res.status(httpStatus.ok).json({
            success: true,
            records: req.body
          });
          next();
        }
      });
    },
    releaseConnection
  );

  // created by Nowshad: to  getPednigBills
  api.get(
    "/getPednigBills",
    getPednigBills,
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

  // created by irfan:
  api.get(
    "/getOpBillSummary",
    getOpBillSummary,
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

  api.get(
    "/get",
    generateDbConnection,
    selectBill,
    getReceiptEntry,
    (req, res, next) => {
      debugLog("test: ", "test");
      let connection = req.connection;
      connection.commit(error => {
        debugLog("error: ", error);
        if (error) {
          connection.rollback(() => {
            next(error);
          });
        } else {
          let _receptEntry = req.receptEntry;
          let _billing = req.records;

          let result = { ..._receptEntry, ..._billing };

          delete req.receptEntry;
          debugLog("OP result : ", result);
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

  return api;
};
