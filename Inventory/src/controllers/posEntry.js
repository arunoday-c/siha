import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehPath from "algaeh-module-bridge";

import {
  getPosEntry,
  addPosEntry
} from "../models/posEntry";

import { updateIntoInvItemLocation } from "../models/commonFunction";
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
