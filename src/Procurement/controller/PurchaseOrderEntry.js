import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addPurchaseOrderEntry,
  getPurchaseOrderEntry,
  updatePurchaseOrderEntry,
  getAuthrequisitionList
} from "../model/initialstock";

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post(
    "/addPurchaseOrderEntry",
    addPurchaseOrderEntry,
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
    "/getAuthrequisitionList",
    getAuthrequisitionList,
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
