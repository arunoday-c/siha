import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addsalesReturn, //Done
  getsalesReturn, //Done
  updatesalesReturn //Done
} from "../model/salesReturn";
import { debugFunction, debugLog } from "../../utils/logging";
import { pharmacyReceiptInsert } from "../model/pharmacyGlobal";
import { getReceiptEntry } from "../../model/receiptentry";

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy POS Entry
  api.post(
    "/addsalesReturn",
    generateDbConnection,
    pharmacyReceiptInsert,
    addsalesReturn,
    updatesalesReturn,
    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        debugLog("error", error);
        debugLog("commit error", error);
        if (error) {
          debugLog("roll error", error);
          connection.rollback(() => {
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

  // created by Nowshad :to get Pos Entry
  api.get(
    "/getsalesReturn",
    generateDbConnection,
    getsalesReturn,
    getReceiptEntry,
    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        debugLog("error", error);
        debugLog("commit error", error);
        if (error) {
          debugLog("roll error", error);
          connection.rollback(() => {
            next(error);
          });
        } else {
          let _receptEntry = req.receptEntry;
          let _sales = req.records;

          let result = { ..._receptEntry, ..._sales };
          debugLog("result : ", result);

          delete req.receptEntry;
          delete req.pos;
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

  // created by Nowshad :update Item Storage and POS
  api.put(
    "/updatesalesReturn",
    updatesalesReturn,
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
