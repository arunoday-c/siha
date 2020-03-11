import { Router } from "express";
import utlities from "algaeh-utilities";
import financeReports from "../models/financeReports";

const {
  getBalanceSheet,
  getProfitAndLoss,
  getTrialBalance,
  getAccountReceivableAging,
  getAccountPayableAging,
  getProfitAndLossCostCenterWise,
  getProfitAndLossMonthWise
} = financeReports;

export default () => {
  const api = Router();

  api.get("/getBalanceSheet", getBalanceSheet, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records
        })
        .end();
    }
  });

  api.get("/getProfitAndLoss", getProfitAndLoss, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records
        })
        .end();
    }
  });
  api.get("/getTrialBalance", getTrialBalance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records
        })
        .end();
    }
  });

  api.get(
    "/getAccountReceivableAging",
    getAccountReceivableAging,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records
          })
          .end();
      }
    }
  );

  api.get(
    "/getAccountPayableAging",
    getAccountPayableAging,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records
          })
          .end();
      }
    }
  );
  api.get(
    "/getProfitAndLossCostCenterWise",
    getProfitAndLossCostCenterWise,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records
          })
          .end();
      }
    }
  );

  api.get(
    "/getProfitAndLossMonthWise",
    getProfitAndLossMonthWise,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records
          })
          .end();
      }
    }
  );
  return api;
};
