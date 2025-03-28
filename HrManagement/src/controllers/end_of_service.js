import { Router } from "express";
import utlities from "algaeh-utilities";
import end_of_service from "../models/end_of_service";
import { getEOSOptions } from "../models/eosOptions";

const {
  endOfService,
  endOfServiceAdd,
  saveEndOfService,
  getGratuityStatus,
} = end_of_service;

export default () => {
  const api = Router();
  api.get("/", endOfService, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records,
    });
  });
  api.get("/getGratuityStatus", getGratuityStatus, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records,
    });
  });
  api.put("/save", endOfServiceAdd, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      // success: req.flag == 1 ? false : true,
      result: req.records,
    });
  });
  api.get("/eosOptions", getEOSOptions, (req, res) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post("/saveTemporary", saveEndOfService, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: req.records,
    });
  });
  return api;
};
