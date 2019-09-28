import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

import commissionModels from "../model/doctorsCommission";
const {
  getDoctorsCommission,
  doctorsCommissionCal,
  commissionCalculations
} = commissionModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to get Doctors Commission
  api.get(
    "/getDoctorsCommission",
    getDoctorsCommission,
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

  // created by irfan :to getDoctorsCommissionCal
  api.post(
    "/doctorsCommissionCal",
    doctorsCommissionCal,
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

  // created by irfan :to getDoctorsCommissionCal
  api.post(
    "/commissionCalculations",
    commissionCalculations,
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
