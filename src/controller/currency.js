import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  addCurrencyMaster, //Done
  getCurrencyMaster, //Done
  deleteCurrencyMaster, //Done
  updateCurrencyMaster //Done
} from "../model/currency";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to addCurrencyMaster
  api.post(
    "/addCurrencyMaster",
    addCurrencyMaster,
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

  // created by irfan :to
  api.get(
    "/getCurrencyMaster",
    getCurrencyMaster,
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

  // created by irfan :to deleteCurrencyMaster
  api.delete(
    "/deleteCurrencyMaster",
    deleteCurrencyMaster,
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

  // created by irfan :to updateCurrencyMaster
  api.put(
    "/updateCurrencyMaster",
    updateCurrencyMaster,
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

  return api;
};
