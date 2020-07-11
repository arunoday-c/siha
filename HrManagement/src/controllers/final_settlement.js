import { Router } from "express";
import utlities from "algaeh-utilities";
import final_settlement from "../models/final_settlement";

const {
  finalSettlement,
  finalSettlemntAdd,
  generateAccountingEntry,
  finalSettlementSave,
} = final_settlement;

export default () => {
  const api = Router();
  api.get("/", finalSettlement, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records,
    });
  });
  api.post("/finalSettlementSave", finalSettlementSave, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records,
    });
  });
  api.post(
    "/save",
    finalSettlemntAdd,
    generateAccountingEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );
  return api;
};
