import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";

import {
  generateNumber,
  addDeliveryNoteEntry,
  getDeliveryNoteEntry,
  updateDeliveryNoteEntry,
  updatePOEntry
} from "../models/DeliveryNoteEntry";

import algaehPath from "algaeh-module-bridge";
const { updateItemMaster } = algaehPath(
  "algaeh-pharmacy/src/models/pharmacyGlobal"
);

const { updateInventoryItemMaster } = algaehPath(
  "algaeh-inventory/src/models/inventoryGlobal"
);

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();
  api.get("/getDeliveryNoteEntry", getDeliveryNoteEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post(
    "/addDeliveryNoteEntry",
    generateNumber,
    (req, res, next) => {
      utilities.logger().log("dn_from: ", req.body.dn_from);
      if (req.body.dn_from == "PHR") {
        updateItemMaster(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      utilities.logger().log("dn_from: ", req.body.dn_from);
      if (req.body.dn_from == "INV") {
        updateInventoryItemMaster(req, res, next);
      } else {
        next();
      }
    },
    addDeliveryNoteEntry,
    updatePOEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateDeliveryNoteEntry",
    updateDeliveryNoteEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
