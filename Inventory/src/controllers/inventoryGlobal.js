import { Router } from "express";
import utlities from "algaeh-utilities";
import invModels from "../models/inventoryGlobal";

const {
  getUomLocationStock,
  getItemMoment,
  getItemLocationStock,
  getInvExpItemsDash,
  getDashboardData,
  getUserLocationPermission,
  getItemandLocationStock,
  getConsumptionSelectedMonth,
  getListUomSelectedItem,
  getItemLocationStockConsumtion,
  getItemUoms,
  getUomLocationStockAdjust,
} = invModels;

export default () => {
  const api = Router();
  api.get("/getUomLocationStock", getUomLocationStock, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getUomLocationStockAdjust",
    getUomLocationStockAdjust,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getItemUoms", getItemUoms, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getListUomSelectedItem",
    getListUomSelectedItem,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getItemMoment", getItemMoment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get("/getItemLocationStock", getItemLocationStock, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get(
    "/getItemLocationStockConsumtion",
    getItemLocationStockConsumtion,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get("/getInvExpItemsDash", getInvExpItemsDash, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get("/getDashboardData", getDashboardData, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get(
    "/getUserLocationPermission",
    getUserLocationPermission,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/getItemandLocationStock",
    getItemandLocationStock,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get(
    "/getConsumptionSelectedMonth",
    getConsumptionSelectedMonth,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  return api;
};
