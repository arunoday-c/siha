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
  getDepartmentVitalMap,
  addExaminationType,
  updateExaminationType,
  getExaminationType,
  getExaminationDescription,
  addExaminationDescription,
  updateExaminationDescription,
  addExaminationCategory,
  updateExaminationCategory,
  getExaminationCategory,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
      });
      next();
    },
    releaseConnection
  );

  // api.delete(
  //   "/deleteVitalMasterHeader",
  //   deleteVitalMasterHeader,
  //   (req, res, next) => {
  //     let result = req.records;
  //     res.status(httpStatus.ok).json({
  //       success: true,
  //       records: result
  //     });
  //     next();
  //   },
  //   releaseConnection
  // );

  api.delete(
    "/deleteVitalMasterDetail",
    deleteVitalMasterDetail,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/getExaminationType",
    getExaminationType,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/addExaminationType",
    addExaminationType,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.put(
    "/updateExaminationType",
    updateExaminationType,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/getExaminationDescription",
    getExaminationDescription,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/addExaminationDescription",
    addExaminationDescription,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.put(
    "/updateExaminationDescription",
    updateExaminationDescription,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/getExaminationCategory",
    getExaminationCategory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/addExaminationCategory",
    addExaminationCategory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  api.put(
    "/updateExaminationCategory",
    updateExaminationCategory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  return api;
};
