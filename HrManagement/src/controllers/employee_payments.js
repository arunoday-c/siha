import { Router } from "express";
import utlities from "algaeh-utilities";
import { getLoanTopayment } from "../models/employee_payments";
export default () => {
  const api = Router();
  api.get("/getLoanTopayment", getLoanTopayment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
