import { Router } from "express";
import { getReport } from "../model/generateReport";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
export default () => {
  let api = Router();

  // created by irfan :to
  api.get(
    "/getReport",
    getReport,
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
