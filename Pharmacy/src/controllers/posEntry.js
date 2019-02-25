import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehPath from "algaeh-module-bridge";

import {
  getPosEntry,
  addPosEntry,
  updatePosEntry,
  getPrescriptionPOS
} from "../models/posEntry";

import { updateIntoItemLocation } from "../models/commonFunction";
// import s from "algaeh-billing/src/models/receiptentry"
const { addReceiptEntry } = algaehPath(
  "algaeh-billing/src/models/receiptentry"
);

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
    updateIntoItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post("/getPrescriptionPOS", getPrescriptionPOS, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
