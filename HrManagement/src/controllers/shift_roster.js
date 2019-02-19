import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getEmployeesForShiftRoster,
  addShiftRoster,
  deleteShiftRoster
} from "../models/shift_roster";
export default () => {
  const api = Router();

  api.get(
    "/getEmployeesForShiftRoster",
    getEmployeesForShiftRoster,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: req.records
        });
      }
    }
  );
  api.post("/addShiftRoster", addShiftRoster, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  });
  api.delete("/deleteShiftRoster", deleteShiftRoster, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  });

  return api;
};
