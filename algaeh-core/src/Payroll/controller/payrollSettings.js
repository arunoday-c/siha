import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import payrollModels from "../model/payrollSettings";

const { getMiscEarningDeductions, assignAuthLevels, dummy } = payrollModels;
const { releaseConnection } = utils;

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
  api.get(
    "/dummy",
    dummy,
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
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );

  return api;
};
