import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import loanModels from "../model/loan";

const {
  addLoanApplication,
  getLoanApplication,
  getLoanLevels,
  authorizeLoan,
  adjustLoanApplication,
  addLoanReciept,
  getEmployeeLoanReciept
} = loanModels;
const { releaseConnection } = utils;

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

  // created by Adnan :
  api.put(
    "/adjustLoanApplication",
    adjustLoanApplication,
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
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
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

  // created by irfan :
  api.post("/addLoanReciept", addLoanReciept, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan :
  api.get(
    "/getEmployeeLoanReciept",
    getEmployeeLoanReciept,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
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
