import { Router } from "express";
import utlities from "algaeh-utilities";
import balanceSheet_report from "../models/balanceSheet_report";

const { getBalanceSheet } = balanceSheet_report;

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
