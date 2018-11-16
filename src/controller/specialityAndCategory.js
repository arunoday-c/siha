import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  addEmployeeSpecialityMaster,
  getEmployeeSpecialityMaster,
  addEmployeeCategoryMaster,
  getEmployeeCategoryMaster
} from "../model/specialityAndCategory";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add
  api.post(
    "/addEmployeeSpecialityMaster",
    addEmployeeSpecialityMaster,
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

  // created by irfan :to get
  api.get(
    "/getEmployeeSpecialityMaster",
    getEmployeeSpecialityMaster,
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

  // created by irfan :to get
  api.post(
    "/addEmployeeCategoryMaster",
    addEmployeeCategoryMaster,
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

  // created by irfan :to get
  api.get(
    "/getEmployeeCategoryMaster",
    getEmployeeCategoryMaster,
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
