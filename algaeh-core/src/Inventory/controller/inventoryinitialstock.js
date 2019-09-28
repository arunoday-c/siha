import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import invInitalModels from "../model/inventoryinitialstock";

const { releaseConnection } = utils;
const {
  addInventoryInitialStock, //Done
  getInventoryInitialStock, //Done
  updateInventoryInitialStock //Done
} = invInitalModels;

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Pharmacy Initial Stock
  api.post(
    "/addInventoryInitialStock",
    addInventoryInitialStock,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to getInventoryInitialStock
  api.get(
    "/getInventoryInitialStock",
    getInventoryInitialStock,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :update Item Storage
  api.put(
    "/updateInventoryInitialStock",
    updateInventoryInitialStock,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  return api;
};
