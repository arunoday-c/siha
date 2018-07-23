import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  physicalExaminationHeader,
  physicalExaminationDetails,
  physicalExaminationSubDetails,
  getPhysicalExamination,
  addOrder,
  addSample,
  addAnalytes,
  addReviewOfSysHeader,
  addReviewOfSysDetails
} from "../model/doctorsWorkBench";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to add  physical_examination_header
  api.post(
    "/physicalExaminationHeader/add",
    physicalExaminationHeader,
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

  // created by irfan : to add  physical_examination_details
  api.post(
    "/physicalExaminationDetails/add",
    physicalExaminationDetails,
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

  // created by irfan : to add  physical_examination_subdetails
  api.post(
    "/physicalExaminationSubDetails/add",
    physicalExaminationSubDetails,
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

  // created by irfan : to get physical examination
  api.get(
    "/getPhysicalExamination/get",
    getPhysicalExamination,
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

  // created by irfan : add order
  api.post(
    "/addOrder",
    addOrder,
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

  // created by irfan : add sample
  api.post(
    "/addSample",
    addSample,
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

  // created by irfan : add analytes
  api.post(
    "/addAnalytes",
    addAnalytes,
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

  // created by irfan : add review_of_system_header
  api.post(
    "/addReviewOfSysHeader",
    addReviewOfSysHeader,
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

  // created by irfan : add review_of_system_details
  api.post(
    "/addReviewOfSysDetails",
    addReviewOfSysDetails,
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
