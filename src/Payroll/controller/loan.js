import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addLoanApplication,
  getLoanApplication,
  getLoanLevels,
  authorizeLoan
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

  // created by irfan
  api.put("/authorizeLoan", authorizeLoan, (req, res, next) => {
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
  return api;
};
