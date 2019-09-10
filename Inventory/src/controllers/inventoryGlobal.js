import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getUomLocationStock,
  getItemMoment,
  getItemLocationStock,
  getUserLocationPermission,
  getItemandLocationStock,
  getConsumptionSelectedMonth
} from "../models/inventoryGlobal";

export default () => {
  const api = Router();
  api.get("/getUomLocationStock", getUomLocationStock, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getItemMoment", getItemMoment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.get("/getItemLocationStock", getItemLocationStock, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.get(
    "/getUserLocationPermission",
    getUserLocationPermission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.get(
    "/getItemandLocationStock",
    getItemandLocationStock,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getConsumptionSelectedMonth",
    getConsumptionSelectedMonth,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
