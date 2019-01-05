import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addPatientNurseChiefComplaints,
  getPatientNurseChiefComplaints,
  deletePatientNurseChiefComplaints,
  updatePatientNurseChiefComplaints,
  getNurseMyDay
} from "../model/nurseWorkBench";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan :
  api.post(
    "/addPatientNurseChiefComplaints",
    addPatientNurseChiefComplaints,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_data == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
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

  api.get(
    "/getPatientNurseChiefComplaints",
    getPatientNurseChiefComplaints,
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
    "/deletePatientNurseChiefComplaints",
    deletePatientNurseChiefComplaints,
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
    "/updatePatientNurseChiefComplaints",
    updatePatientNurseChiefComplaints,
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
    "/getNurseMyDay",
    getNurseMyDay,
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
