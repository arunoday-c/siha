import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

import orderModels from "../model/orderMedication";

const { releaseConnection } = utils;
const {
  addPatientPrescription,
  getPatientPrescription,
  getPatientMedications,
  addPastMedication,
  deletePastMedication,
  getPastMedication,
} = orderModels;

export default ({ config, db }) => {
  let api = Router();
  // created by irfan: to  addPatientPrescription
  api.post(
    "/addPatientPrescription",
    addPatientPrescription,
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
    "/addPastMedication",
    addPastMedication,
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
  api.delete(
    "/deletePastMedication",
    deletePastMedication,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results,
      });
      next();
    },
    releaseConnection
  );
  // created by irfan: to  getPatientPrescription
  api.get(
    "/getPatientPrescription",
    getPatientPrescription,
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

  api.get("/getPatientMedications", getPatientMedications, (req, res, next) => {
    res.status(httpStatus.ok).json({
      success: true,
      records: req.records,
    });
    next();
  });

  api.get("/getPastMedication", getPastMedication, (req, res, next) => {
    res.status(httpStatus.ok).json({
      success: true,
      records: req.records,
    });
    next();
  });

  return api;
};
