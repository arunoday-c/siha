import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import { getPatientDiagnosis } from "../models/dashboard";
export default () => {
  const api = Router();
  const utilities = new algaehUtilities();
  api.get("/patientDiagnosis", getPatientDiagnosis, (req, res, next) => {
    const _records = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _records
    });
    delete req.records;
  });
  return api;
};
