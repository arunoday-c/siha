import { Router } from "express";
import utlities from "algaeh-utilities";
import finance from "../models/finance";

const {
  getAccountHeads,
  addAccountHeads,
  getFinanceAccountsMaping,
  addFinanceAccountsMaping
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
    "/addFinanceAccountsMaping",
    addFinanceAccountsMaping,
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

  return api;
};
