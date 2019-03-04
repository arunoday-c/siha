import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addPatientType,
  updatePatientType,
  deletePatientType,
  getPatientType
} from "../models/patientType";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/add", addPatientType, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/update", updatePatientType, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getPatientType", getPatientType, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete("/delete", deletePatientType, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
