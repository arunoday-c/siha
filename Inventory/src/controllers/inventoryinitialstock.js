import { Router } from "express";
import utlities from "algaeh-utilities";
import intialModels from "../models/inventoryinitialstock";
import comModels from "../models/commonFunction";
import invModels from "../models/inventoryGlobal";

const { updateInventoryItemMaster } = invModels;
const { updateIntoInvItemLocation } = comModels;
const {
  generateNumber,
  getInventoryInitialStock,
  addInventoryInitialStock,
  updateInventoryInitialStock
} = intialModels;

export default () => {
  const api = Router();
  api.get(
    "/getInventoryInitialStock",
    getInventoryInitialStock,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/addInventoryInitialStock",
    generateNumber,
    updateInventoryItemMaster,
    addInventoryInitialStock,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateInventoryInitialStock",
    updateInventoryInitialStock,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
