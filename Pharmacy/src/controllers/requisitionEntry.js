import { Router } from "express";
import utlities from "algaeh-utilities";

import reqModels from "../models/requisitionEntry";
const {
  getrequisitionEntry,
  addrequisitionEntry,
  updaterequisitionEntry,
  getAuthrequisitionList
} = reqModels;

export default () => {
  const api = Router();
  api.get("/getrequisitionEntry", getrequisitionEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addrequisitionEntry", addrequisitionEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put(
    "/updaterequisitionEntry",
    updaterequisitionEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getAuthrequisitionList",
    getAuthrequisitionList,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
