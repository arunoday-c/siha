import { Router } from "express";
import utlities from "algaeh-utilities";
import intModels from "../models/initialstock";
import comModels from "../models/commonFunction";
import pharModels from "../models/pharmacyGlobal";
const {
  generateNumber,
  getPharmacyInitialStock,
  addPharmacyInitialStock,
  updatePharmacyInitialStock
} = intModels;
const { updateIntoItemLocation } = comModels;
const { updateItemMaster } = pharModels;
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
    generateNumber,
    updateItemMaster,
    addPharmacyInitialStock,
    updateIntoItemLocation,
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
