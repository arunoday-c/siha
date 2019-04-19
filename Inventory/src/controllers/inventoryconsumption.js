import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getInventoryConsumption,
  addInventoryConsumption
} from "../models/inventoryconsumption";

import { updateIntoInvItemLocation } from "../models/commonFunction";

export default () => {
  const api = Router();
  api.get(
    "/getInventoryConsumption",
    getInventoryConsumption,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/addInventoryConsumption",
    addInventoryConsumption,
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
