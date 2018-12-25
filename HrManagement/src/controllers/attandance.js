import { Router } from "express";
import utlities from "../../../AlgaehUtilities";
import { processAttendance } from "../models/attendance";
export default () => {
  const api = Router();
  api.get("/processAttendance", processAttendance, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
