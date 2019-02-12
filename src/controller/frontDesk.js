import { Router } from "express";
//import extend from "extend";
import { downloadImage, readFileToBase64 } from "../utils/images";
import { releaseConnection } from "../utils";
import { debugLog, debugFunction } from "../utils/logging";
import {
  addFrontDesk, //Done
  updateFrontDesk, //Done
  selectFrontDesk, //Done
  getCashHandoverDetails, //Done
  updateCashHandoverDetails //Done
} from "../model/frontDesk";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/add",
    addFrontDesk,
    (req, res, next) => {
      debugLog("Data: ", req.body.patient_Image);
      debugLog("req.body: ", req.body);
      if (req.body.patient_Image != null) {
        debugLog("Download Image : ");
        downloadImage(
          req.body.patient_Image,
          req.body.patient_code,
          req.body.patient_code
        );
        delete req.body.patient_Image;
      }
      next();
    },
    (req, res, next) => {
      debugLog("Data1:");

      res.status(httpStatus.ok).json({
        success: true,
        records: req.body
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/update",
    updateFrontDesk,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.body
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/get",
    selectFrontDesk,
    (req, res, next) => {
      if (req.records == null) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        const patient_Image = readFileToBase64(
          req.query.patient_code,
          req.query.patient_code
        );
        res.status(httpStatus.ok).json({
          success: true,
          records: { ...req.records, patient_Image: patient_Image }
        });
        next();
      }
    },
    releaseConnection
  );

  // created by irfan :to
  api.get(
    "/getCashHandoverDetails",
    getCashHandoverDetails,
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

  // created by irfan :to
  api.put(
    "/updateCashHandoverDetails",
    updateCashHandoverDetails,
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
