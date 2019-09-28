import { Router } from "express";
import patRegModels from "../model/patientRegistration";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

const { releaseConnection } = utils;
const {
  addPatientToRegisteration, //Done
  updatePatientRegistrstion, //Done
  patientSelect
} = patRegModels;

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
