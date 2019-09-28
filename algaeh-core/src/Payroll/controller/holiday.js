import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import holiday from "../model/holiday";

const {
  addWeekOffs,
  getAllHolidays,
  addHoliday,
  deleteHoliday,
  getMSDb,
  getTimeSheet,
  getDailyTimeSheet,
  postTimeSheet
} = holiday;
const { releaseConnection } = utils;

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

  // created by irfan
  api.delete("/deleteHoliday", deleteHoliday, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.get("/getMSDb", getMSDb, (req, res, next) => {
    let result = req.records;

    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });

    next();
  });

  // created by irfan :
  api.get(
    "/getTimeSheet",
    getTimeSheet,
    (req, res, next) => {
      let result = req.records;

      if (result.invalid_data == true) {
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
    "/getDailyTimeSheet",
    getDailyTimeSheet,
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
  api.get(
    "/postTimeSheet",
    postTimeSheet,
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
