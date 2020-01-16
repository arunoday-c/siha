import { Router } from "express";
import utlities from "algaeh-utilities";

import transferModels from "../models/transferEntry";
import comModels from "../models/commonFunction";
import reqModels from "../models/requisitionEntry";
const { updaterequisitionEntryOnceTranfer } = reqModels;
const { updateIntoItemLocation } = comModels;
const {
  gettransferEntry,
  addtransferEntry,
  updatetransferEntry,
  getrequisitionEntryTransfer,
  getAckTransferList,
  generateAccountingEntry
} = transferModels;

export default () => {
  const api = Router();
  api.get("/gettransferEntry", gettransferEntry, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  });

  api.post(
    "/addtransferEntry",
    addtransferEntry,
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

  api.put(
    "/updatetransferEntry",
    updatetransferEntry,
    generateAccountingEntry,
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
  api.get("/getAckTransferList", getAckTransferList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
