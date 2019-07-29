import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addOpBillCancellation,
  getBillCancellation,
  updateOPBilling,
  updateEncounterDetails,
  checkLabSampleCollected,
  checkRadSheduled
} from "../models/opBillCancellation";
import { getReceiptEntry, addReceiptEntry } from "../models/receiptentry";

export default () => {
  const api = Router();

  api.post(
    "/addOpBillCancellation",
    addReceiptEntry,
    addOpBillCancellation,
    updateEncounterDetails,
    (req, res, next) => {
      if (req.patientencounter.internal_error == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.patientencounter
        });
      } else {
        next();
      }
    },
    checkLabSampleCollected,
    (req, res, next) => {
      if (req.laboratory.internal_error == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.laboratory
        });
      } else {
        next();
      }
    },
    checkRadSheduled,
    (req, res, next) => {
      if (req.radiology.internal_error == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.radiology
        });
      } else {
        next();
      }
    },
    updateOPBilling,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getBillCancellation",
    getBillCancellation,
    getReceiptEntry,

    (req, res, next) => {
      let _receptEntry = req.receptEntry;
      let _billing = req.records;

      let result = { ..._receptEntry, ..._billing };
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
    }
  );

  return api;
};
