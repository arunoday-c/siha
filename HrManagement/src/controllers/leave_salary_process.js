import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getLeaveSalaryProcess,
  processLeaveSalary,
  InsertLeaveSalary
} from "../models/leave_salary_process";
export default () => {
  const api = Router();
  api.get("/getLeaveSalaryProcess", getLeaveSalaryProcess, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get("/processLeaveSalary", processLeaveSalary, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.post("/InsertLeaveSalary", InsertLeaveSalary, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  return api;
};
