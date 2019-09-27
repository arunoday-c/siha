import { Router } from "express";
import utlities from "algaeh-utilities";
import pharModels from "../models/pharmacyGlobal";

const {
  getUomLocationStock,
  getVisitPrescriptionDetails,
  getItemMoment,
  getItemLocationStock,
  getUserLocationPermission,
  getItemandLocationStock,
  getConsumptionSelectedMonth,
  insertExpiryNotification,
  getExpiringItemList
} = pharModels;

export default () => {
  const api = Router();
  api.get("/getUomLocationStock", getUomLocationStock, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/getVisitPrescriptionDetails",
    getVisitPrescriptionDetails,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
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

  api.post(
    "/insertExpiryNotification",
    insertExpiryNotification,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getExpiringItemList", getExpiringItemList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
