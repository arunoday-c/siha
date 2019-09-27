import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
import deliveyModels from "../models/DeliveryNoteEntry";
import pharmacyComModels from "algaeh-pharmacy/src/models/commonFunction";
import inventoryComModels from "algaeh-inventory/src/models/commonFunction";

const {
  generateNumber,
  addDeliveryNoteEntry,
  getDeliveryNoteEntry,
  updateDeliveryNoteEntry,
  updatePOEntry
} = deliveyModels;

const { updateIntoItemLocation } = pharmacyComModels;
const { updateIntoInvItemLocation } = inventoryComModels;

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
    addDeliveryNoteEntry,
    updatePOEntry,
    (req, res, next) => {
      if (req.body.dn_from == "PHR") {
        updateIntoItemLocation(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      if (req.body.dn_from == "INV") {
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
