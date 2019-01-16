import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  processSalary,
  getSalaryProcess,
  getSalaryProcessToPay
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
  return api;
};
