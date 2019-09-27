import { Router } from "express";
import utlities from "algaeh-utilities";

import invTransModels from "../models/inventorytransferEntry";
import comModels from "../models/commonFunction";
import invReqModels from "../models/inventoryrequisitionEntry";
const { updateIntoInvItemLocation } = comModels;
const {
  gettransferEntry,
  addtransferEntry,
  updatetransferEntry,
  getrequisitionEntryTransfer,
  getAckTransferList
} = invTransModels;
const { updateinvreqEntryOnceTranfer } = invReqModels;

export default () => {
  const api = Router();
  api.get("/gettransferEntry", gettransferEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getAckTransferList", getAckTransferList, (req, res, next) => {
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
