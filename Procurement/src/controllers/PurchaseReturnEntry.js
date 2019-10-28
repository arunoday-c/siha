import { Router } from "express";
import utlities from "algaeh-utilities";
import purchaseReturnModels from "../models/PurchaseReturnEntry";

const { getReceiptEntryItems } = purchaseReturnModels;

export default () => {
  const api = Router();
  // const utilities = new algaehUtilities();
  api.get("/getReceiptEntryItems", getReceiptEntryItems, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
