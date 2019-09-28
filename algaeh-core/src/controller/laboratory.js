import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import labModels from "../model/laboratory";

const { releaseConnection } = utils;
const {
  getLabOrderedServices, //Done
  insertLadOrderedServices, //Done
  updateLabOrderServices, //Done
  getTestAnalytes, //Done
  updateLabSampleStatus, // Done
  updateLabResultEntry //Done
} = labModels;

export default ({ config, db }) => {
  let api = Router();

  // created by nowshad : to get lab services in lab tables
  api.get(
    "/getLabOrderedServices",
    getLabOrderedServices,
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

  // created by nowshad : to get lab services in lab tables
  api.get(
    "/getTestAnalytes",
    getTestAnalytes,
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

  // created by nowshad : to insert lab services in lab tables
  api.post(
    "/insertLadOrderedServices",
    insertLadOrderedServices,
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
    "/updateLabOrderServices",
    updateLabOrderServices,
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

  //created by irfan: to update Lab Specimen Status
  api.put(
    "/updateLabSampleStatus",
    updateLabSampleStatus,
    (req, res, next) => {
      let resultSelect = req.records;
      if (resultSelect.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultSelect
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );

  //created by irfan: to update Lab Result Entry
  api.put(
    "/updateLabResultEntry",
    updateLabResultEntry,
    (req, res, next) => {
      let resultSelect = req.records;
      if (resultSelect.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultSelect
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
