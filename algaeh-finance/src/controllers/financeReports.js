import { Router } from "express";
import utlities from "algaeh-utilities";
import financeReports from "../models/financeReports";
const accountNameWidth = 63;
const accountNameArabicWidth = 63;
const amountWidth = 15;
const {
  getBalanceSheet,
  getProfitAndLoss,
  getTrialBalance,
  getAccountReceivableAging,
  getAccountPayableAging,
  getProfitAndLossCostCenterWise,
  getProfitAndLossMonthWise
} = financeReports;
import { generateExcel } from "../excels/index";
export default () => {
  const api = Router();

  api.get(
    "/getBalanceSheet",
    getBalanceSheet,
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
        const { excel } = req.query;
        if (excel === "true") {
          req.reportName = "Balance Sheet";
          req.sheetName = "Balance Sheet";
          req.columns = [
            {
              header: "Account Name",
              key: "title",
              width: accountNameWidth
            },
            {
              header: "Arabic Name",
              key: "arabic_name",
              width: accountNameArabicWidth
            },
            {
              header: "Amount",
              key: "subtitle",
              width: amountWidth,
              others: {
                alignment: { vertical: "middle", horizontal: "right" }
              }
            }
          ];
          next();
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
    },
    generateExcel
  );

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
