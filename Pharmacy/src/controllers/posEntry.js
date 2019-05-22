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
const { addReceiptEntry, getReceiptEntry } = algaehPath(
  "algaeh-billing/src/models/receiptentry"
);

export default () => {
  const api = Router();
  api.get("/getPosEntry", getPosEntry, getReceiptEntry, (req, res, next) => {
    let _receptEntry = req.receptEntry;
    let _pos = req.records;
    let result = { ..._receptEntry, ..._pos };

    delete req.receptEntry;
    delete req.pos;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
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
