import { Router } from "express";
import utlities from "algaeh-utilities";
import loan from "../models/loan";

const {
  addLoanApplication,
  adjustLoanApplication,
  getLoanApplication,
  authorizeLoan,
  getLoanLevels,
  addLoanReciept,
  getEmployeeLoanReciept,
  getEmployeeLoanOpenBal,
  mailSendForLoan,
  sendAuthorizeLoanRejEmail,
  sendAuthorizeLoanEmail,
} = loan;

export default () => {
  const api = Router();

  api.post("/addLoanApplication", addLoanApplication, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });
  api.get("/mailSendForLoan", mailSendForLoan, (req, res, next) => {
    let statusCode = utlities.AlgaehUtilities().httpStatus().ok;

    if (req.sendingMail) {
      statusCode = 201;
    }
    res.status(statusCode).json({
      success: true,
      records: req.records,
    });
  });
  api.put("/adjustLoanApplication", adjustLoanApplication, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });
  api.get("/getLoanApplication", getLoanApplication, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });
  api.put(
    "/authorizeLoan",
    authorizeLoan,
    (req, res, next) => {
      if (req.body.authorized === "A") {
        sendAuthorizeLoanEmail(req, res, next);
      } else if (req.body.authorized === "R") {
        sendAuthorizeLoanRejEmail(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      let statusCode = utlities.AlgaehUtilities().httpStatus().ok;

      if (req.sendingMail) {
        statusCode = 201;
      }
      if (req.records.invalid_input == true) {
        res.status(statusCode).json({
          success: false,
          records: req.records,
        });
      } else {
        res.status(statusCode).json({
          success: true,
          records: req.records,
        });
      }
    }
  );

  api.get("/getLoanLevels", getLoanLevels, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });
  api.post("/addLoanReciept", addLoanReciept, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });
  api.get(
    "/getEmployeeLoanReciept",
    getEmployeeLoanReciept,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: req.records,
        });
      }
    }
  );

  api.get(
    "/getEmployeeLoanOpenBal",
    getEmployeeLoanOpenBal,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getLoanLevels", getLoanLevels, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });

  return api;
};
