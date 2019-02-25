import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addDeliveryNoteEntry,
  getDeliveryNoteEntry,
  updateDeliveryNoteEntry,
  updatePOEntry
} from "../models/DeliveryNoteEntry";

export default () => {
  const api = Router();
  api.get("/getDeliveryNoteEntry", getDeliveryNoteEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post(
    "/addDeliveryNoteEntry",
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
