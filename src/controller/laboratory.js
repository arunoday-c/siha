import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  getLabOrderedServices,
  insertLadOrderedServices,
  updateLabOrderServices,
  getTestAnalytes
} from "../model/laboratory";

export default ({ config, db }) => {
  let api = Router();

  // created by nowshad : to get lab services in lab tables
  api.get(
    "/getLabOrderedServices",
    getLabOrderedServices,
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

  // created by nowshad : to get lab services in lab tables
  api.get(
    "/getTestAnalytes",
    getTestAnalytes,
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

  // created by nowshad : to insert lab services in lab tables
  api.post(
    "/insertLadOrderedServices",
    insertLadOrderedServices,
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

  api.put(
    "/updateLabOrderServices",
    updateLabOrderServices,
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
