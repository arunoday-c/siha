import { Router } from "express";
import utlities from "algaeh-utilities";
import purchaseReturnModels from "../models/PurchaseReturnEntry";
import pharmacyComModels from "algaeh-pharmacy/src/models/commonFunction";
import inventoryComModels from "algaeh-inventory/src/models/commonFunction";

const {
  getReceiptEntryItems,
  addPurchaseReturnEntry,
  cancelPurchaseOrderEntry,
  getPurchaseReturnEntry,
  postPurchaseOrderEntry,
  generateAccountingEntry
} = purchaseReturnModels;

const { updateIntoItemLocation } = pharmacyComModels;
const { updateIntoInvItemLocation } = inventoryComModels;

export default () => {
  const api = Router();
  // const utilities = new algaehUtilities();
  api.get("/getReceiptEntryItems", getReceiptEntryItems, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getPurchaseReturnEntry", getPurchaseReturnEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addPurchaseReturnEntry", addPurchaseReturnEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put("/cancelPurchaseOrderEntry", cancelPurchaseOrderEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put("/postPurchaseOrderEntry",
    postPurchaseOrderEntry,
    generateAccountingEntry,
    (req, res, next) => {
      if (req.body.po_return_from == "PHR") {
        updateIntoItemLocation(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      if (req.body.po_return_from == "INV") {
        updateIntoInvItemLocation(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    });



  return api;
};
