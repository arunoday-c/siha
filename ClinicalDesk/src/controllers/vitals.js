import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import vitalModels from "../models/vitals";

const { getPatientVitals } = vitalModels;

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();
  api.get("/", getPatientVitals, (req, res, next) => {
    const _records = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _records
    });
    delete req.records;
  });
  return api;
};
