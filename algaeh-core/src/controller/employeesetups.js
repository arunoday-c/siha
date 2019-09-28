import { Router } from "express";
import setupModels from "../model/employeesetups";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

const { releaseConnection } = utils;
const {
  getDesignations, //Done
  getEmpSpeciality,
  getEmpCategory,
  addDesignation, //Done
  deleteDesignation, //Done
  getOvertimeGroups, //Done
  addOvertimeGroups, //Done
  deleteOvertimeGroups, //Done
  updateOvertimeGroups //Done
} = setupModels;

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/getDesignations",
    getDesignations,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
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
    "/getEmpSpeciality",
    getEmpSpeciality,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
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
    "/getEmpCategory",
    getEmpCategory,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
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

  //created by irfan:
  api.post(
    "/addDesignation",
    addDesignation,
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
  api.delete("/deleteDesignation", deleteDesignation, (req, res, next) => {
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
  });

  //created by Adnan
  api.get(
    "/getOvertimeGroups",
    getOvertimeGroups,
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

  //created by Adnan
  api.post(
    "/addOvertimeGroups",
    addOvertimeGroups,
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

  //created by Adnan
  api.delete(
    "/deleteOvertimeGroups",
    deleteOvertimeGroups,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "Please provide valid input"
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

  //created by Adnan
  api.put("/updateOvertimeGroups", updateOvertimeGroups, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: "Please provide valid input"
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  return api;
};
