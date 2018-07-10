import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";

import {
  getPatientInsurence,
  addPatientInsurence,
  getListOfInsurenceProvider
} from "../model/insurence";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to fetch insurence based on patient id
  api.get(
    "/getPatientInsurence",
    getPatientInsurence,
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

  // created by irfan : to save insurence of patient in DB
  api.post(
    "/addPatientInsurence",
    addPatientInsurence,
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

  // created by irfan : to get all insurence provider  company details
  api.get(
    "/getListOfInsurenceProvider",
    getListOfInsurenceProvider,
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
