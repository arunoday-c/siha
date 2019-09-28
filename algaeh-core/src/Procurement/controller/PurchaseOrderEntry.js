import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import purchaseModels from "../model/PurchaseOrderEntry";
import logUtils from "../../utils/logging";

const { debugLog } = logUtils;
const {
  addPurchaseOrderEntry, //Done
  getPurchaseOrderEntry, //Done
  updatePurchaseOrderEntry, //Done
  getAuthPurchaseList, //Done
  getInvRequisitionEntryPO, //Done
  getPharRequisitionEntryPO, //Done
  updatePharReqEntry, //Done
  updateInvReqEntry //Done
} = purchaseModels;
const { releaseConnection, generateDbConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post(
    "/addPurchaseOrderEntry",
    generateDbConnection,
    addPurchaseOrderEntry,

    (req, res, next) => {
      debugLog("phr.req.body", req.body);
      if (req.body.po_from == "PHR" && req.body.phar_requisition_id != null) {
        updatePharReqEntry(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      debugLog("inv.req.body", req.body);
      if (req.body.po_from == "INV" && req.body.inv_requisition_id != null) {
        debugLog("Data Exist: ", "Yes");
        updateInvReqEntry(req, res, next);
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

  // created by Nowshad :to getPharmacyInitialStock
  api.get(
    "/getPurchaseOrderEntry",
    getPurchaseOrderEntry,
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

  // created by Nowshad :to get Pharmacy RequisitionEntry for PO
  api.get(
    "/getPharRequisitionEntryPO",
    getPharRequisitionEntryPO,
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

  // created by Nowshad :to get Inventory RequisitionEntry for PO
  api.get(
    "/getInvRequisitionEntryPO",
    getInvRequisitionEntryPO,
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
    "/updatePurchaseOrderEntry",
    updatePurchaseOrderEntry,
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
