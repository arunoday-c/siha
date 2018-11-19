import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { addVendorMaster, getVendorMaster } from "../model/vendor";

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

  return api;
};
