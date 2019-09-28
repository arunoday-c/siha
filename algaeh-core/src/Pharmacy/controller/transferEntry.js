import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import transferModels from "../model/transferEntry";
import logUtils from "../../utils/logging";
import reqModels from "../model/requisitionEntry";

const { updaterequisitionEntryOnceTranfer } = reqModels;
const { debugLog } = logUtils;
const {
  addtransferEntry, //Done
  gettransferEntry, //Done
  updatetransferEntry, //Done
  getrequisitionEntryTransfer //Done
} = transferModels;
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
    updaterequisitionEntryOnceTranfer,
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
