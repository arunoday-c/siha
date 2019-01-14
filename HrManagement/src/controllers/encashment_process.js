import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getEncashmentToProcess,
  getLeaveEncashLevels,
  InsertLeaveEncashment
} from "../models/encashment_process";
export default () => {
  const api = Router();
  api.get(
    "/getEncashmentToProcess",
    getEncashmentToProcess,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  api.get("/getLeaveEncashLevels", getLeaveEncashLevels, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.post(
    "/InsertLeaveEncashment",
    InsertLeaveEncashment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  return api;
};
