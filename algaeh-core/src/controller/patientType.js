import { Router } from "express";
import utils from "../utils";
import logUtils from "../utils/logging";
import patientTypeModels from "../model/patientType";
import httpStatus from "../utils/httpStatus";

const {
  selectPattypeStatement, //Not in Use
  addPatientType, //Done
  updatePatientType, //Done
  deletePatientType, //Done
  getPatientType //Done
} = patientTypeModels;
const { debugLog } = logUtils;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  api.delete(
    "/delete",
    deletePatientType,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json(result);
      next();
    },
    releaseConnection
  );

  api.get(
    "/get",
    selectPattypeStatement,
    (req, res, next) => {
      debugLog("Data: ", req.records);
      let result;
      if (req.records !== undefined) {
        result = new Object();
        result["totalPages"] = req.records[1][0].total_pages;
        result["data"] = req.records[0];
      }
      debugLog("Data: ", result);
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/getPatientType",
    getPatientType,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
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

  api.post(
    "/add",
    addPatientType,
    (req, res, next) => {
      let result = req.records;
      if (result.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );
  api.put(
    "/update",
    updatePatientType,
    (req, res, next) => {
      let result = req.records;
      if (result.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );
  return api;
};
