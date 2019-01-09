import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  processAttendance
  //addAttendanceRegularization
} from "../models/attendance";
export default () => {
  const api = Router();
  api.get("/processAttendance", processAttendance, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get(
    "/addAttendanceRegularization",
    (req, res, next) => {
      console.log("Here in function");
      res.status(200).json({
        success: true
      });
    },
    //  addAttendanceRegularization,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );
  return api;
};
