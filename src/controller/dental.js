import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import {
  addTreatmentPlan,
  addDentalTreatment,
  getTreatmentPlan
} from "../model/dental";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to
  api.post(
    "/addTreatmentPlan",
    addTreatmentPlan,
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

  // created by irfan :to
  api.post(
    "/addDentalTreatment",
    addDentalTreatment,
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

  // created by irfan :to
  api.get(
    "/getTreatmentPlan",
    getTreatmentPlan,
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
