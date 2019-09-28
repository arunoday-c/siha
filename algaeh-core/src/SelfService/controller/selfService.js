import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
// import {
//   // getEmployeeBasicDetails,
//   // getEmployeeDependentDetails,
//   // getEmployeeIdentificationDetails,
//   // updateEmployeeIdentificationDetails,
//   // updateEmployeeDependentDetails,
//   // updateEmployeeBasicDetails,
//   // getLeaveMaster,
//   // addEmployeeDependentDetails,
//   deleteEmployeeDependentDetails
// } from "../model/selfService";
import selfModels from "../model/selfService";

const { deleteEmployeeDependentDetails } = selfModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();
  //code

  // created by irfan :
  // api.get(
  //   "/getEmployeeBasicDetails",
  //   getEmployeeBasicDetails,
  //   (req, res, next) => {
  //     let result = req.records;
  //     res.status(httpStatus.ok).json({
  //       success: true,
  //       records: result
  //     });
  //     next();
  //   },
  //   releaseConnection
  // );

  // created by irfan :
  // api.get(
  //   "/getEmployeeDependentDetails",
  //   getEmployeeDependentDetails,
  //   (req, res, next) => {
  //     let result = req.records;
  //     res.status(httpStatus.ok).json({
  //       success: true,
  //       records: result
  //     });
  //     next();
  //   },
  //   releaseConnection
  // );

  // created by irfan :
  // api.get(
  //   "/getEmployeeIdentificationDetails",
  //   getEmployeeIdentificationDetails,
  //   (req, res, next) => {
  //     let result = req.records;
  //     res.status(httpStatus.ok).json({
  //       success: true,
  //       records: result
  //     });
  //     next();
  //   },
  //   releaseConnection
  // );

  // created by irfan
  // api.put(
  //   "/updateEmployeeIdentificationDetails",
  //   updateEmployeeIdentificationDetails,
  //   (req, res, next) => {
  //     let result = req.records;
  //     if (result.invalid_input == true) {
  //       res.status(httpStatus.ok).json({
  //         success: false,
  //         records: "please provide valid input"
  //       });
  //     } else {
  //       res.status(httpStatus.ok).json({
  //         success: true,
  //         records: result
  //       });
  //     }
  //     next();
  //   }
  // );

  // created by irfan
  // api.put(
  //   "/updateEmployeeDependentDetails",
  //   updateEmployeeDependentDetails,
  //   (req, res, next) => {
  //     let result = req.records;
  //     if (result.invalid_input == true) {
  //       res.status(httpStatus.ok).json({
  //         success: false,
  //         records: "please provide valid input"
  //       });
  //     } else {
  //       res.status(httpStatus.ok).json({
  //         success: true,
  //         records: result
  //       });
  //     }
  //     next();
  //   }
  // );

  // created by irfan
  // api.put(
  //   "/updateEmployeeBasicDetails",
  //   updateEmployeeBasicDetails,
  //   (req, res, next) => {
  //     let result = req.records;
  //     if (result.invalid_input == true) {
  //       res.status(httpStatus.ok).json({
  //         success: false,
  //         records: "please provide valid input"
  //       });
  //     } else {
  //       res.status(httpStatus.ok).json({
  //         success: true,
  //         records: result
  //       });
  //     }
  //     next();
  //   }
  // );

  // created by Adnan :
  // api.get(
  //   "/getLeaveMaster",
  //   getLeaveMaster,
  //   (req, res, next) => {
  //     let result = req.records;
  //     res.status(httpStatus.ok).json({
  //       success: true,
  //       records: result
  //     });
  //     next();
  //   },
  //   releaseConnection
  // );

  // created by IRFAN :
  // api.post(
  //   "/addEmployeeDependentDetails",
  //   addEmployeeDependentDetails,
  //   (req, res, next) => {
  //     let result = req.records;
  //     res.status(httpStatus.ok).json({
  //       success: true,
  //       records: result
  //     });
  //     next();
  //   },
  //   releaseConnection
  // );

  // created by IRFAN :
  api.delete(
    "/deleteEmployeeDependentDetails",
    deleteEmployeeDependentDetails,
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
