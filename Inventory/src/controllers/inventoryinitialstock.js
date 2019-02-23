import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getInventoryInitialStock,
  addInventoryInitialStock,
  updateInventoryInitialStock
} from "../models/inventoryinitialstock";

import { updateIntoInvItemLocation } from "../models/commonFunction";

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
    addInventoryInitialStock,
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
