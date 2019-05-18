import { Router } from "express";
import utlities from "algaeh-utilities";

import {
  gettransferEntry,
  addtransferEntry,
  updatetransferEntry,
  getrequisitionEntryTransfer
} from "../models/transferEntry";
import { updateIntoItemLocation } from "../models/commonFunction";
import { updaterequisitionEntryOnceTranfer } from "../models/requisitionEntry";
export default () => {
  const api = Router();
  api.get("/gettransferEntry", gettransferEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addtransferEntry", addtransferEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put(
    "/updatetransferEntry",
    updatetransferEntry,
    updaterequisitionEntryOnceTranfer,
    updateIntoItemLocation,
    updateIntoItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getrequisitionEntryTransfer",
    getrequisitionEntryTransfer,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
