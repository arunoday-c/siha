import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getPatientInsurance,
  updatePatientData
} from "../models/patientRegistration";

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

  return api;
};
