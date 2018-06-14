import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { getServiceType } from "../model/serviceTypes";
export default ({ config, db }) => {
  let api = Router();
  api.get(
    "/",
    getServiceType,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
      next();
    },
    releaseConnection
  );
  return api;
};
