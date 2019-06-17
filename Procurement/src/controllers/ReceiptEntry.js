import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addReceiptEntry,
  getReceiptEntry,
  updateReceiptEntry,
  updateDNEntry
} from "../models/ReceiptEntry";

// import { x } from "algaeh-inventory/src/models/commonFunction";
import algaehPath from "algaeh-module-bridge";
const { updateIntoItemLocation } = algaehPath(
  "algaeh-pharmacy/src/models/commonFunction"
);

const { updateIntoInvItemLocation } = algaehPath(
  "algaeh-inventory/src/models/commonFunction"
);
import algaehUtilities from "algaeh-utilities/utilities";

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();
  api.get("/getReceiptEntry", getReceiptEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

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
