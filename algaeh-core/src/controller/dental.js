import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import dental from "../model/dental";

const { releaseConnection } = utils;
const {
  addTreatmentPlan,
  addDentalTreatment,
  getTreatmentPlan,
  getDentalTreatment,
  approveTreatmentPlan,
  deleteDentalPlan,
  updateDentalPlanStatus,
  updateDentalTreatmentStatus,
  updateDentalTreatmentBilledStatus,
  updateDentalTreatment
} = dental;

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to
  api.post(
    "/addTreatmentPlan",
    addTreatmentPlan,
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
  api.post(
    "/addDentalTreatment",
    addDentalTreatment,
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
  api.get(
    "/getTreatmentPlan",
    getTreatmentPlan,
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
  api.get(
    "/getDentalTreatment",
    getDentalTreatment,
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
    "/approveTreatmentPlan",
    approveTreatmentPlan,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "please provide valid input"
        });
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

  // created by irfan :to
  api.delete(
    "/deleteDentalPlan",
    deleteDentalPlan,
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
    "/updateDentalPlanStatus",
    updateDentalPlanStatus,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "please provide valid input"
        });
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

  // created by irfan :to
  api.put(
    "/updateDentalTreatmentStatus",
    updateDentalTreatmentStatus,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "please provide valid input"
        });
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

  // created by irfan :to
  api.put(
    "/updateDentalTreatmentBilledStatus",
    updateDentalTreatmentBilledStatus,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "please provide valid input"
        });
      } else if (result.affectedRows == 0) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "records doesn't match"
        });
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

  // created by irfan :to
  api.put(
    "/updateDentalTreatment",
    updateDentalTreatment,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "please provide valid input"
        });
      } else if (result.affectedRows == 0) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "records doesn't match"
        });
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
  return api;
};
