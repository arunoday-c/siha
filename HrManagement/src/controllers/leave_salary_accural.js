import { Router } from "express";
import utlities from "algaeh-utilities";
import leave_salary_accural from "../models/leave_salary_accural";

const { getLeaveSalaryAccural } = leave_salary_accural;

export default () => {
  const api = Router();

  api.get("/getLeaveSalaryAccural", getLeaveSalaryAccural, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
