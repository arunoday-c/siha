import { Router } from "express";
import utlities from "algaeh-utilities";
import leave_salary_process from "../models/leave_salary_process";

const {
  getLeaveSalaryProcess,
  processLeaveSalary,
  InsertLeaveSalary,
  getLeaveSalary,
  getEmployeeAnnualLeaveToProcess,
  generateAccountingEntry,
} = leave_salary_process;

export default () => {
  const api = Router();
  api.get("/getLeaveSalaryProcess", getLeaveSalaryProcess, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records,
    });
  });

  api.get("/processLeaveSalary", processLeaveSalary, (req, res, next) => {
    // console.log("req.records", req.records);
    let result = req.records;

    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: result, //req.records,
      hims_f_salary_id: req.salaryID,
    });
  });

  api.post(
    "/InsertLeaveSalary",
    InsertLeaveSalary,
    generateAccountingEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  api.get("/getLeaveSalary", getLeaveSalary, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: req.records,
    });
  });

  api.get(
    "/getEmployeeAnnualLeaveToProcess",
    getEmployeeAnnualLeaveToProcess,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: req.flag == 1 ? false : true,
        result: req.records,
      });
    }
  );

  return api;
};
