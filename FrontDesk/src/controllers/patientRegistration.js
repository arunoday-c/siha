import { Router } from "express";
import utlities from "algaeh-utilities";
import regModels from "../models/patientRegistration";

const {
  getPatientInsurance,
  updatePatientData,
  getVisitServiceAmount,
  getPatientAdvaceAndRefund,
  insertPatientData,
  registerPatient,
  releaseDB
} = regModels;

export default () => {
  const api = Router();

  api.get(
    "/getPatientInsurance",
    getPatientInsurance,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.post(
    "/registerPatient",
    registerPatient,
    insertPatientData,
    releaseDB,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.get(
    "/getVisitServiceAmount",
    getVisitServiceAmount,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updatePatientData",
    updatePatientData,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.get(
    "/getPatientAdvaceAndRefund",
    getPatientAdvaceAndRefund,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
