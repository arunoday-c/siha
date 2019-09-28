import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import opBillModels from "../model/opBilling";
import onpModels from "../model/orderAndPreApproval";
import logUtils from "../utils/logging";
import radModels from "../model/radiology";
import labModels from "../model/laboratory";
import recModels from "../model/receiptentry";

const { getReceiptEntry } = recModels;
const { updateRadOrderedBilled, insertRadOrderedServices } = radModels;
const { updateLabOrderedBilled, insertLadOrderedServices } = labModels;
const { debugLog } = logUtils;
const { updateOrderedServicesBilled } = onpModels;
const { releaseConnection, generateDbConnection } = utils;
const {
  addOpBIlling, //Done
  selectBill, //Done
  getPednigBills, //Done
  getOpBillSummary //Not Used
} = opBillModels;

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
