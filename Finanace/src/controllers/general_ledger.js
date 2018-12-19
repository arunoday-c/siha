import { Router } from "express";
import utlities from "../../../AlgaehUtilities";
import { generalLedgerGet } from "../models/general_ledger";
export default () => {
  const api = Router();
  api.post("/test", generalLedgerGet, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
