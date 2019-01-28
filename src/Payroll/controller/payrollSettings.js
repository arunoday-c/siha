import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  getMiscEarningDeductions,
  assignAuthLevels
} from "../model/payrollSettings";

export default ({ config, db }) => {
  let api = Router();

  // created by Adnan :
  api.get(
    "/getMiscEarningDeductions",
    getMiscEarningDeductions,
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

  // created by Adnan :
  api.post(
    "/assignAuthLevels",
    assignAuthLevels,
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
