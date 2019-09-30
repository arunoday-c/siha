import { Router } from "express";
import utlities from "algaeh-utilities";
import general_ledger from "../models/general_ledger";

const { generalLedgerGet } = general_ledger;

export default () => {
  const api = Router();
  api.get("/test", generalLedgerGet, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
