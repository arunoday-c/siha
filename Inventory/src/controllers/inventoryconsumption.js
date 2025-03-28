import { Router } from "express";
import utlities from "algaeh-utilities";
import invModels from "../models/inventoryconsumption";
import comModels from "../models/commonFunction";

const {
  getInventoryConsumption,
  getInventoryConsumptionCancel,
  addInventoryConsumption,
  addInvConsumptionCancel,
  generateAccountingEntry,
  generateAccountingEntryCancel,
} = invModels;
const { updateIntoInvItemLocation } = comModels;

export default () => {
  const api = Router();
  api.get(
    "/getInventoryConsumption",
    getInventoryConsumption,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/getInventoryConsumptionCancel",
    getInventoryConsumptionCancel,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/addInventoryConsumption",
    addInventoryConsumption,
    generateAccountingEntry,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/addInvConsumptionCancel",
    addInvConsumptionCancel,
    generateAccountingEntry,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/cancelConsumtion",
    generateAccountingEntryCancel,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  return api;
};
