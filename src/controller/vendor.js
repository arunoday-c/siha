import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  addVendorMaster,
  getVendorMaster,
  updateVendorMaster,
  deleteVendorMaster,
  makeVendorMasterInActive
} from "../model/vendor";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to get
  api.post(
    "/addVendorMaster",
    addVendorMaster,
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

  // created by irfan :to get
  api.get(
    "/getVendorMaster",
    getVendorMaster,
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

  // created by irfan :to get
  api.put(
    "/updateVendorMaster",
    updateVendorMaster,
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

  // created by irfan :to get
  api.delete(
    "/deleteVendorMaster",
    deleteVendorMaster,
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
  // created by irfan :to get
  api.put(
    "/makeVendorMasterInActive",
    makeVendorMasterInActive,
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
