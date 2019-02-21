import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getPharmacyInitialStock,
  addPharmacyInitialStock,
  updatePharmacyInitialStock
} from "../models/initialstock";

import { updateIntoItemLocation } from "../models/commonFunction";

export default () => {
  const api = Router();
  api.get(
    "/getPharmacyInitialStock",
    getPharmacyInitialStock,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/addPharmacyInitialStock",
    addPharmacyInitialStock,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updatePharmacyInitialStock",
    updatePharmacyInitialStock,
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
