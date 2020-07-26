import { Router } from "express";
import utlities from "algaeh-utilities";
import profit_and_loss_report from "../models/profit_and_loss_report";

const { getProfitAndLoss } = profit_and_loss_report;

export default () => {
  const api = Router();

  api.get("/getProfitAndLoss", getProfitAndLoss, (req, res, next) => {
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
