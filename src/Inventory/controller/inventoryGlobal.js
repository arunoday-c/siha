import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  getUomLocationStock,
  getItemMoment,
  getItemLocationStock,
  getUserLocationPermission,
  getItemandLocationStock
} from "../model/inventoryGlobal";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :get global
  api.get(
    "/getUomLocationStock",
    getUomLocationStock,
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

  // created by Nowshad :get Item Moment
  api.get(
    "/getItemMoment",
    getItemMoment,
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

  // created by Nowshad :get item batch for selcted location
  api.get(
    "/getItemLocationStock",
    getItemLocationStock,
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

  // created by Nowshad :get item batch for selcted location
  api.get(
    "/getItemandLocationStock",
    getItemandLocationStock,
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

  // created by Nowshad :get item batch for selcted location
  api.get(
    "/getUserLocationPermission",
    getUserLocationPermission,
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
