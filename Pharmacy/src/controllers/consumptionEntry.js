import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getconsumptionEntry,
  addconsumptionEntry
} from "../models/consumptionEntry";

import { updateIntoItemLocation } from "../models/commonFunction";

export default () => {
  const api = Router();
  api.get("/getconsumptionEntry", getconsumptionEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post(
    "/addconsumptionEntry",
    addconsumptionEntry,
    updateIntoItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
