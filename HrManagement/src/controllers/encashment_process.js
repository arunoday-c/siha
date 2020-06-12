import { Router } from "express";
import utlities from "algaeh-utilities";
import encashment_process from "../models/encashment_process";

const {
  getEncashmentToProcess,
  getLeaveEncashLevels,
  InsertLeaveEncashment,
  getLeaveEncash,
  UpdateLeaveEncash,
  calculateEncashmentAmount,
  getEncashmentApplied
} = encashment_process;

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

  api.get("/getLeaveEncash", getLeaveEncash, (req, res, next) => {
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

  api.put("/UpdateLeaveEncash", UpdateLeaveEncash, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get(
    "/calculateEncashmentAmount",
    calculateEncashmentAmount,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );
  api.get("/getEncashmentApplied", getEncashmentApplied, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  return api;
};
