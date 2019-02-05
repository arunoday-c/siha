import { Router } from "express";
import utlities from "algaeh-utilities";
import { authorizeLeave, calculateLeaveDays } from "../models/leave";
export default () => {
  const api = Router();
  api.put("/authorizeLeave", authorizeLeave, (req, res, next) => {
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

  api.get("/calculateLeaveDays", calculateLeaveDays, (req, res, next) => {
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
