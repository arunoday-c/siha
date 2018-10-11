import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  getPatientMrdList,
  getPatientEncounterDetails,
  getPatientChiefComplaint,
  getPatientDiagnosis,
  getPatientMedication
} from "../model/mrd";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to get Patient Mrd List
  api.get(
    "/getPatientMrdList",
    getPatientMrdList,
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

  // created by irfan :to get Patient Encounter Details
  api.get(
    "/getPatientEncounterDetails",
    getPatientEncounterDetails,
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

  // created by irfan :to get Patient Chief Complaint
  api.get(
    "/getPatientChiefComplaint",
    getPatientChiefComplaint,
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

  // created by irfan :to getPatientDiagnosis
  api.get(
    "/getPatientDiagnosis",
    getPatientDiagnosis,
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

  // created by irfan :to getPatientMedication
  api.get(
    "/getPatientMedication",
    getPatientMedication,
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
