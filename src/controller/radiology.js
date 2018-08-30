import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  getRadOrderedServices,
  insertRadOrderedServices
} from "../model/radiology";

export default ({ config, db }) => {
  let api = Router();

  // created by nowshad : to get lab services in lab tables
  api.get(
    "/getRadOrderedServices",
    getRadOrderedServices,
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
    "/insertRadOrderedServices",
    insertRadOrderedServices,
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
