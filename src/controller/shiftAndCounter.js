import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
    addShiftMaster,
    addCounterMaster,
    getCounterMaster,
    getShiftMaster,
    updateShiftMaster,
    updateCounterMaster
} from "../model/shiftAndCounter";

export default ({ config, db }) => {
  let api = Router();


  // created by irfan :to  addShiftMaster
  api.post(
    "/addShiftMaster",
    addShiftMaster,
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
  
  // created by irfan :to  addCounterMaster
  api.post(
    "/addCounterMaster",
    addCounterMaster,
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


    
    // created by irfan :to  getCounterMaster
  api.get(
    "/getCounterMaster",
    getCounterMaster,
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
  // created by irfan :to  getShiftMaster
  api.get(
    "/getShiftMaster",
    getShiftMaster,
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


  // created by irfan :to  updateCounterMaster
  api.update(
    "/updateCounterMaster",
    updateCounterMaster,
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


  // created by irfan :to  updateShiftMaster
  api.update(
    "/updateShiftMaster",
    updateShiftMaster,
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
