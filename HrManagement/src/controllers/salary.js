import { Router } from "express";
import utlities from "algaeh-utilities";
import { processSalary } from "../models/salary";
export default () => {
  const api = Router();
  api.get("/processSalary", processSalary, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
