import { Router } from "express";
import utlities from "algaeh-utilities";
import leave_approval from "../models/leave_approval";

const { getAppliedLeaveDays } = leave_approval;

export default () => {
  const api = Router();
  api.get("/getAppliedLeaveDays", getAppliedLeaveDays, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
