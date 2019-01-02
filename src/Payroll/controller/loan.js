import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addLoanApplication,
  getLoanApplication,
  getLoanLevels
} from "../model/loan";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :
  api.post(
    "/addLoanApplication",
    addLoanApplication,
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
    "/getLoanApplication",
    getLoanApplication,
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
  api.get("/getLoanLevels", getLoanLevels, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
