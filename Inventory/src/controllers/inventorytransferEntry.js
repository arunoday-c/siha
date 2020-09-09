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
  getAckTransferList,
  generateAccountingEntry
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
    (req, res, next) => {
      if (req.body.ack_done == "Y") {
        generateAccountingEntry(req, res, next);
      } else {
        next();
      }
    },
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
    generateAccountingEntry,
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
