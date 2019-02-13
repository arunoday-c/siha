import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  processSalary,
  getSalaryProcess,
  getSalaryProcessToPay,
  finalizedSalaryProcess,
  SaveSalaryPayment,
  getWpsEmployees
} from "../models/salary";
export default () => {
  const api = Router();
  api.get(
    "/processSalary",
    processSalary,
    getSalaryProcess,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  api.get("/getSalaryProcess", getSalaryProcess, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get("/getSalaryProcessToPay", getSalaryProcessToPay, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.put(
    "/finalizedSalaryProcess",
    finalizedSalaryProcess,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  api.put("/SaveSalaryPayment", SaveSalaryPayment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });


  api.get("/getWpsEmployees", getWpsEmployees, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  });

  return api;
};
