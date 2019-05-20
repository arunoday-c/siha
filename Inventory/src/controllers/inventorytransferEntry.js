import { Router } from "express";
import utlities from "algaeh-utilities";

import {
  gettransferEntry,
  addtransferEntry,
  updatetransferEntry,
  getrequisitionEntryTransfer
} from "../models/inventorytransferEntry";
import { updateIntoInvItemLocation } from "../models/commonFunction";
import { updateinvreqEntryOnceTranfer } from "../models/inventoryrequisitionEntry";
export default () => {
  const api = Router();
  api.get("/gettransferEntry", gettransferEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post(
    "/addtransferEntry",
    addtransferEntry,
    updateinvreqEntryOnceTranfer,
    updateIntoInvItemLocation,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updatetransferEntry",
    updatetransferEntry,
    updateinvreqEntryOnceTranfer,
    updateIntoInvItemLocation,
    updateIntoInvItemLocation,
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
