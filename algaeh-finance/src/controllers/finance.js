import { Router } from "express";
import utlities from "algaeh-utilities";
import finance from "../models/finance";

const { getAccountHeads } = finance;

export default () => {
  const api = Router();

  api.get("/getAccountHeads", getAccountHeads, (req, res, next) => {
    if (req.records.no_data == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  return api;
};
