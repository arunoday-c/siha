import { Router } from "express";
import {
  billingCalculations,
  patientAdvanceRefund,
  getBillDetails,
  addEpisodeEncounter
} from "../model/billing";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

export default ({ config, db }) => {
  let api = Router();

  api.post(
    "/billingCalculations",
    billingCalculations,
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

  api.post(
    "/getBillDetails",
    getBillDetails,
    (req, res, next) => {
      let resultBack = req.records;
      if (resultBack.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No record found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultBack
        });
      }

      next();
    },
    releaseConnection
  );

  // created by irfan : to get advance and to refund
  api.post(
    "/patientAdvanceRefund",
    patientAdvanceRefund,
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

  //created by irfan: to add episode and encounter
  api.post(
    "/addEpisodeEncounter",
    addEpisodeEncounter,
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
