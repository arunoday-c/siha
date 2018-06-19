import { Router } from "express";
import {
  addDepartment,
  updateDepartment,
  selectDepartment,
  selectSubDepartment,
  addSubDepartment,
  updateSubDepartment,
  deleteDepartment
} from "../model/department";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/add",
    addDepartment,
    (req, res, next) => {
      let resultTables = req.records;
      if (resultTables.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultTables
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No more records"));
      }
    },
    releaseConnection
  );
  api.put(
    "/update",
    updateDepartment,
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
  api.get(
    "/get",
    selectDepartment,
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
    "/get/subdepartment",
    selectSubDepartment,
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
    "/add/subdepartment",
    addSubDepartment,
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
    "/update/subdepartment",
    updateSubDepartment,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );
  api.delete(
    "/delete",
    deleteDepartment,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json(result);
      next();
    },
    releaseConnection
  );

  return api;
};
