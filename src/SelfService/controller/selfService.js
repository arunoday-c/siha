import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  getEmployeeBasicDetails,
  getEmployeeDependentDetails,
  getEmployeeIdentificationDetails,
  updateEmployeeIdentificationDetails
} from "../model/selfService";

export default ({ config, db }) => {
  let api = Router();
  //code

  // created by irfan :
  api.get(
    "/getEmployeeBasicDetails",
    getEmployeeBasicDetails,
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

  // created by irfan :
  api.get(
    "/getEmployeeDependentDetails",
    getEmployeeDependentDetails,
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

  // created by irfan :
  api.get(
    "/getEmployeeIdentificationDetails",
    getEmployeeIdentificationDetails,
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

  // created by irfan
  api.put(
    "/updateEmployeeIdentificationDetails",
    updateEmployeeIdentificationDetails,
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
    }
  );

  return api;
};
