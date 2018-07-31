import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";

import {
  getPatientInsurance,
  addPatientInsurance,
  getListOfInsuranceProvider,
  addInsuranceProvider,
  updateInsuranceProvider,
  addSubInsuranceProvider,
  updateSubInsuranceProvider,
  addNetwork,
  NetworkOfficeMaster,
  addPlanAndPolicy
} from "../model/insurance";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to fetch insurence based on patient id
  api.get(
    "/getPatientInsurance",
    getPatientInsurance,
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
    "/addPatientInsurance",
    addPatientInsurance,
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
    "/getListOfInsuranceProvider",
    getListOfInsuranceProvider,
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

  // created by irfan : to add insurence provider
  api.post(
    "/addInsuranceProvider",
    addInsuranceProvider,
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

  // created by irfan : to update insurence provider
  api.put(
    "/updateInsuranceProvider",
    updateInsuranceProvider,
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

  // created by irfan : to add SUB-insurence provider
  api.post(
    "/addSubInsuranceProvider",
    addSubInsuranceProvider,
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

  // created by irfan : to update SUB-insurence provider
  api.put(
    "/updateSubInsuranceProvider",
    updateSubInsuranceProvider,
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

  // created by irfan : to add network(insurence plan)
  api.post(
    "/addNetwork",
    addNetwork,
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

  // created by irfan : to add network office(insurence policy)
  api.post(
    "/NetworkOfficeMaster",
    NetworkOfficeMaster,
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

  // created by irfan: to add  both network and network office(insurence plan master)
  api.post(
    "/addPlanAndPolicy",
    addPlanAndPolicy,
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
