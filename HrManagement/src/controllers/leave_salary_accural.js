import { Router } from "express";
import utlities from "algaeh-utilities";
import { getLeaveSalaryAccural } from "../models/leave_salary_accural";
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
