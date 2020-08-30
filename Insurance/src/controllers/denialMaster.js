import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getDenialReasons,
  addDenialReason,
  deleteDenialReason,
  updateDenialReason,
} from "../models/denialMaster";

export default () => {
  let api = Router();

  api.get("/getDenialReasons", getDenialReasons, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/addDenialReason", addDenialReason, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put("/updateDenialReason", updateDenialReason, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.delete("/deleteDenialReason", deleteDenialReason, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  return api;
};
