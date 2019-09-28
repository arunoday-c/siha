import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import invModels from "../model/inventoryGlobal";

const { releaseConnection } = utils;
const {
  getUomLocationStock, //Done
  getItemMoment, //Done
  getItemLocationStock, //Done
  getUserLocationPermission, //Done
  getItemandLocationStock //Done
} = invModels;

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
