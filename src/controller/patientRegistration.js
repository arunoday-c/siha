import { Router } from "express";
import {
  addPatientToRegisteration, //Done
  updatePatientRegistrstion, //Done
  patientSelect
} from "../model/patientRegistration";
import { releaseConnection } from "../utils";
import { CLIENT_RENEG_WINDOW } from "tls";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/add",
    addPatientToRegisteration,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      }
    },
    releaseConnection
  );
  api.put(
    "/update",
    updatePatientRegistrstion,
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
    "/get",
    patientSelect,
    (req, res, next) => {
      let result = req.records;

      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No record found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      }
    },
    releaseConnection
  );
  return api;
};
