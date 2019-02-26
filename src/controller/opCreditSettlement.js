import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import {
  addCreidtSettlement, //Done
  getCreidtSettlement, //Done
  updateOPBilling, //Done
  getPatientwiseBill //Done
} from "../model/opCreditSettlement";

import { debugFunction, debugLog } from "../utils/logging";
import { getReceiptEntry, ReceiptPaymentInsert } from "../model/receiptentry";
import extend from "extend";
export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad : to save opBilling
  api.post(
    "/addCreidtSettlement",
    generateDbConnection,
    ReceiptPaymentInsert,
    addCreidtSettlement,
    updateOPBilling,
    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        if (error) {
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

  api.get(
    "/getCreidtSettlement",
    generateDbConnection,
    getCreidtSettlement,
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
          debugLog("result:", req.records);
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

  api.get(
    "/getPatientwiseBill",
    getPatientwiseBill,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
      next();
    },
    releaseConnection
  );

  /////
  return api;
};
