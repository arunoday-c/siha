import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import {
  addInvestigationTest,
  getInvestigTestList,
  updateInvestigationTest
} from "../model/investigation";
export default ({ config, db }) => {
  let api = Router();

  api.post(
    "/addInvestigationTest",
    addInvestigationTest,
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

  // created by irfan : to get list of test based on condition
  api.get(
    "/getInvestigTestList",
    getInvestigTestList,
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
    "/updateInvestigationTest",
    updateInvestigationTest,
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
