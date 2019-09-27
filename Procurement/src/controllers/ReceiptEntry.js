import { Router } from "express";
import utlities from "algaeh-utilities";
import receiptModels from "../models/ReceiptEntry";
// import pharmacyModels from "algaeh-pharmacy/src/models/commonFunction";
// import inventoryModels from "algaeh-inventory/src/models/commonFunction";
// import algaehUtilities from "algaeh-utilities/utilities";

const {
  addReceiptEntry,
  getReceiptEntry,
  updateReceiptEntry,
  updateDNEntry,
  getDeliveryForReceipt,
  getDeliveryItemDetails
} = receiptModels;
// const { updateIntoItemLocation } = pharmacyModels;
// const { updateIntoInvItemLocation } = inventoryModels;

export default () => {
  const api = Router();
  // const utilities = new algaehUtilities();
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

  // (req, res, next) => {
  //   utilities.logger().log("grn_for: ", req.body.grn_for);
  //   if (req.body.grn_for == "PHR") {
  //     updateIntoItemLocation(req, res, next);
  //   } else {
  //     next();
  //   }
  // },
  // (req, res, next) => {
  //   if (req.body.grn_for == "INV") {
  //     utilities.logger().log("grn_for: ", req.body.grn_for);
  //     updateIntoInvItemLocation(req, res, next);
  //   } else {
  //     next();
  //   }
  // },

  return api;
};
