import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import salaryModels from "../model/salary";

const { processSalary } = salaryModels;
const { releaseConnection } = utils;

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
