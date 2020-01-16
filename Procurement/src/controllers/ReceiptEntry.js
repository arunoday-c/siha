import { Router } from "express";
import utlities from "algaeh-utilities";
import receiptModels from "../models/ReceiptEntry";
const {
  addReceiptEntry,
  getReceiptEntry,
  updateReceiptEntry,
  updateDNEntry,
  getDeliveryForReceipt,
  getDeliveryItemDetails,
  postReceiptEntry,
  generateAccountingEntry
} = receiptModels;

export default () => {
  const api = Router();
  api.get("/getReceiptEntry", getReceiptEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getDeliveryForReceipt", getDeliveryForReceipt, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/getDeliveryItemDetails",
    getDeliveryItemDetails,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/addReceiptEntry",
    addReceiptEntry,
    updateDNEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put("/updateReceiptEntry", updateReceiptEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put("/postReceiptEntry",
    postReceiptEntry,
    generateAccountingEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    });

  return api;
};
