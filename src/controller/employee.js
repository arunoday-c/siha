import { Router } from "express";
import { releaseConnection } from "../utils";
import {
  addEmployee,
  getEmployee,
  updateEmployee,
  getEmployeeDetails,
  getDoctorServiceCommission,
  getEmployeeCategory,
  getDoctorServiceTypeCommission,
  addEmployeeGroups
} from "../model/employee";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();

  api.post(
    "/addEmployee",
    addEmployee,
    (req, res, next) => {
      let resultBack = req.records;
      if (resultBack.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No record found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultBack
        });
      }

      next();
    },
    releaseConnection
  );

  api.post(
    "/addEmployeeGroups",
    addEmployeeGroups,
    (req, res, next) => {
      let resultBack = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: resultBack
      });
      next();
    },
    releaseConnection
  );

  api.put(
    "/updateEmployee",
    updateEmployee,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        message: "Updated successfully",
        records: result
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/get",
    getEmployee,
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
    "/getEmployeeDetails",
    getEmployeeDetails,
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
    "/getEmployeeCategory",
    getEmployeeCategory,
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
    "/getDoctorServiceCommission",
    getDoctorServiceCommission,
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
    "/getDoctorServiceTypeCommission",
    getDoctorServiceTypeCommission,
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
