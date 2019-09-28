import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import hpiModels from "../model/hpi";

const {
  addIcd,
  getHpiElements,
  addHpiElement,
  addPatientHpi,
  getPatientHpi
} = hpiModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();
  //code

  // created by irfan : add ICD
  api.post(
    "/addIcd",
    addIcd,
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

  // created by irfan : to  getHpiElements
  api.get(
    "/getHpiElements",
    getHpiElements,
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

  // created by irfan : to add addHpiElement
  api.post(
    "/addHpiElement",
    addHpiElement,
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

  // created by irfan : to add addPatientHpi
  api.post(
    "/addPatientHpi",
    addPatientHpi,
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

  // created by irfan : to getPatientHpi
  api.get(
    "/getPatientHpi",
    getPatientHpi,
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
