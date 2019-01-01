import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { addWeekOffs, getAllHolidays, addHoliday } from "../model/holiday";
import { debugLog } from "../../utils/logging";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan :
  api.post(
    "/addWeekOffs",
    addWeekOffs,
    (req, res, next) => {
      let result = req.records;

      if (result.weekOff_exist == true) {
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

  // created by irfan :
  api.get(
    "/getAllHolidays",
    getAllHolidays,
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

  // created by irfan :

  api.post(
    "/addHoliday",
    addHoliday,
    (req, res, next) => {
      let result = req.records;

      if (result.holiday_exist == true) {
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
