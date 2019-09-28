import { Router } from "express";
import reportModels from "../model/generateReport";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

const { releaseConnection } = utils;
const { getReport } = reportModels;

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
        input: req.query,
        records: result
      });
      next();
    },
    releaseConnection
  );

  return api;
};
