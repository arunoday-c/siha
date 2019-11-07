import { Router } from "express";
import utlities from "algaeh-utilities";
import finance from "../models/finance";

const {
  getAccountHeads,
  addAccountHeads,
  getFinanceAccountsMaping,
  updateFinanceAccountsMaping,
  getDayEndData,
  postDayEndData,
  removeAccountHead,
  test
} = finance;

export default () => {
  const api = Router();

  api.get("/getAccountHeads", getAccountHeads, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: false,
          result: req.records
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
  api.post("/addAccountHeads", addAccountHeads, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: false,
          result: req.records
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
    "/getFinanceAccountsMaping",
    getFinanceAccountsMaping,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: false,
            result: req.records
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
  api.post(
    "/updateFinanceAccountsMaping",
    updateFinanceAccountsMaping,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
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
  api.get("/getDayEndData", getDayEndData, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
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
  api.post("/postDayEndData", postDayEndData, (req, res, next) => {
    if (
      req.records.invalid_input == true &&
      req.records.invalid_input != undefined
    ) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
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
  api.delete("/removeAccountHead", removeAccountHead, (req, res, next) => {
    if (
      req.records.invalid_input == true &&
      req.records.invalid_input != undefined
    ) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
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
  api.post("/test", test, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records
      })
      .end();
  });

  return api;
};
