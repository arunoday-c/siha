import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  processAttendance
  //addAttendanceRegularization
} from "../models/attendance";
export default () => {
  const api = Router();
  api.get("/processAttendance", processAttendance, (req, res, next) => {
    if (req.records.no_data == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  return api;
};
