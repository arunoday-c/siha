import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import serviceModels from "../model/serviceTypes";

const {
  getServiceType, //Done
  getServices, //Done
  addServices, //Done
  updateServices //Done
} = serviceModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();
  api.get(
    "/",
    getServiceType,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/getService",
    getServices,

    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/addServices",
    addServices,
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
    "/updateServices",
    updateServices,
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
