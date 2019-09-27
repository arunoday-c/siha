import { Router } from "express";
import utlities from "algaeh-utilities";
import recModels from "algaeh-billing/src/models/receiptentry";
import posModels from "../models/posEntry";
import comModels from "../models/commonFunction";
const { getPosEntry, addPosEntry } = posModels;
const { updateIntoInvItemLocation } = comModels;
const { addReceiptEntry } = recModels;

export default () => {
  const api = Router();
  api.get("/getPosEntry", getPosEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post(
    "/addPosEntry",
    addReceiptEntry,
    addPosEntry,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
