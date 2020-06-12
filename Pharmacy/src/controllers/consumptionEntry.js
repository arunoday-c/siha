import { Router } from "express";
import utlities from "algaeh-utilities";
import conEntryModels from "../models/consumptionEntry";
import comModels from "../models/commonFunction";
const { getconsumptionEntry, addconsumptionEntry, generateAccountingEntry } = conEntryModels;

const { updateIntoItemLocation } = comModels;
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
    generateAccountingEntry,
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
