import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { processSalary } from "../model/salary";
import { debugLog } from "../../utils/logging";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan :
  api.get(
    "/processSalary",
    processSalary,
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
