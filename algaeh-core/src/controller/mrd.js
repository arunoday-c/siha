import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import mrdModels from "../model/mrd";

const { releaseConnection } = utils;
const {
  getPatientMrdList, //Done
  getPatientEncounterDetails, //Done
  getPatientChiefComplaint, //Done
  getPatientDiagnosis, //Done
  getPatientMedication, //Done
  getPatientInvestigation, //Done
  getPatientPaymentDetails,
  getPatientTreatments
} = mrdModels;

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

  // created by irfan :to get Patient Investigation
  api.get(
    "/getPatientInvestigation",
    getPatientInvestigation,
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

  // created by irfan :to  getPatientPaymentDetails
  api.get(
    "/getPatientPaymentDetails",
    getPatientPaymentDetails,
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
  // created by irfan :to  getPatientTreatments
  api.get(
    "/getPatientTreatments",
    getPatientTreatments,
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
