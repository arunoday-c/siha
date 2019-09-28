import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import invTranferModels from "../model/inventorytransferEntry";
import logUtils from "../../utils/logging";
import invReqModels from "../model/inventoryrequisitionEntry";

const { updateinvreqEntryOnceTranfer } = invReqModels;
const { debugFunction, debugLog } = logUtils;
const {
  addtransferEntry, //Done
  gettransferEntry, //Done
  updatetransferEntry, //Done
  getrequisitionEntryTransfer //Done
} = invTranferModels;
const { releaseConnection, generateDbConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy POS Entry
  api.post(
    "/addtransferEntry",
    addtransferEntry,
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

  // created by Nowshad :to get Pos Entry
  api.get(
    "/gettransferEntry",
    gettransferEntry,
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

  // created by Nowshad :update Item Storage and POS
  api.put(
    "/updatetransferEntry",
    generateDbConnection,
    updatetransferEntry,
    updateinvreqEntryOnceTranfer,
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
    "/getrequisitionEntryTransfer",
    getrequisitionEntryTransfer,
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

  return api;
};
