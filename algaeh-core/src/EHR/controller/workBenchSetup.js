import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import workBenchModels from "../model/workBenchSetup";

const {
  addVitalMasterHeader,
  addVitalMasterDetail,
  getVitalMasterHeader,
  getVitalMasterDetail,
  deleteVitalMasterHeader,
  deleteVitalMasterDetail,
  updateVitalMasterHeader,
  updateVitalMasterDetail,
  addDepartmentVitalMap,
  getDepartmentVitalMap
} = workBenchModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to add  physical_examination_header
  api.post(
    "/addVitalMasterHeader",
    addVitalMasterHeader,
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

  api.get(
    "/getVitalMasterHeader",
    getVitalMasterHeader,
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

  api.post(
    "/addVitalMasterDetail",
    addVitalMasterDetail,
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

  api.get(
    "/getVitalMasterDetail",
    getVitalMasterDetail,
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

  api.delete(
    "/deleteVitalMasterHeader",
    deleteVitalMasterHeader,
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

  api.delete(
    "/deleteVitalMasterDetail",
    deleteVitalMasterDetail,
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
    "/updateVitalMasterHeader",
    updateVitalMasterHeader,
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
    "/updateVitalMasterDetail",
    updateVitalMasterDetail,
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

  api.post(
    "/addDepartmentVitalMap",
    addDepartmentVitalMap,
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

  api.get(
    "/getDepartmentVitalMap",
    getDepartmentVitalMap,
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
