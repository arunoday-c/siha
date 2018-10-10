import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  getUomLocationStock,
  getVisitPrescriptionDetails
} from "../model/pharmacyGlobal";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :get global
  api.get(
    "/getUomLocationStock",
    getUomLocationStock,
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

  // created by Nowshad :get global
  api.get(
    "/getVisitPrescriptionDetails",
    getVisitPrescriptionDetails,
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
