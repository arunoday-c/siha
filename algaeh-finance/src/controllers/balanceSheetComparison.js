import { Router } from "express";
import utlities from "algaeh-utilities";
import balanceSheetComparison from "../models/balanceSheetComparison";

const { getBalanceSheet } = balanceSheetComparison;

export default () => {
  const api = Router();

  api.get("/getBalanceSheet", getBalanceSheet, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
  });

  return api;
};
