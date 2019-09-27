import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import dayModels from "../models/myday";

const {
  getMydayList,
  patientEncounterUpdate,
  getPatientDetailList,
  getPatientVisits
} = dayModels;

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();
  api.get("/", getMydayList, (req, res, next) => {
    const _records = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _records
    });
    delete req.records;
  });
  api.get("/patientDetails", getPatientDetailList, (req, res, next) => {
    const _records = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _records
    });
    delete req.records;
  });
  api.put("/update", patientEncounterUpdate, (req, res, next) => {
    const _records = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _records
    });
    delete req.records;
  });
  api.get("/visits", getPatientVisits, (req, res, next) => {
    const _records = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _records
    });
    delete req.records;
  });

  return api;
};
