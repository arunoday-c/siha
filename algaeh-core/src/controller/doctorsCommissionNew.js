import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

import commissionModels from "../model/doctorsCommissionNew";
const {
  getDoctorsCommission,
  doctorsCommissionCal,
  commissionCalculations,
  addDoctorsCommission,
  getGeneratedCommission,
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
        records: result,
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
        records: result,
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
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/addDoctorsCommission",
    addDoctorsCommission,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getGeneratedCommission",
    getGeneratedCommission,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  return api;
};
