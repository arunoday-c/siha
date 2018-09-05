import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  getRadOrderedServices,
  insertRadOrderedServices,
  updateRadOrderedServices,
  getRadTemplateList
} from "../model/radiology";

export default ({ config, db }) => {
  let api = Router();

  // created by nowshad : to get Rad orders in Rad tables
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

  // created by nowshad : to insert Rad orders in Rad tables
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

  // created by nowshad : to update rad orders
  api.put(
    "/updateRadOrderedServices",
    updateRadOrderedServices,
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

  // created by nowshad : to get Slected service templates
  api.get(
    "/getRadTemplateList",
    getRadTemplateList,
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
