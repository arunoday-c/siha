import { Router } from "express";
import utlities from "algaeh-utilities";
import opModels from "../models/opBillCancellation";
import billModule from "../models/billing";
const {
  addOpBillCancellation,
  getBillCancellation,
  updateOPBilling,
  updateEncounterDetails,
  checkLabSampleCollected,
  checkRadSheduled,
  generateAccountingEntry,
  checkDentalProcedure,
  cancelPackage,
  updateOrderServices,
} = opModels;
import recModels from "../models/receiptentry";
const { getReceiptEntry, addReceiptEntry } = recModels;
const { reVertCashHandover } = billModule;

export default () => {
  const api = Router();

  api.post(
    "/addOpBillCancellation",
    addReceiptEntry,
    addOpBillCancellation,
    updateOrderServices,
    updateEncounterDetails,
    (req, res, next) => {
      if (req.patientencounter.internal_error == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.patientencounter,
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
          records: req.laboratory,
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
          records: req.radiology,
        });
      } else {
        next();
      }
    },
    checkDentalProcedure,
    (req, res, next) => {
      if (req.dental_procedure.internal_error == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.dental_procedure,
        });
      } else {
        next();
      }
    },

    cancelPackage,
    generateAccountingEntry,
    reVertCashHandover,
    (req, res, next) => {
      if (
        req.records.internal_error != undefined &&
        req.records.internal_error == true
      ) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,

          records: {
            internal_error: req.records.internal_error,
            message: req.records.message,
          },
        });
      } else {
        next();
      }
    },
    updateOPBilling,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
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
        records: result,
      });
    }
  );
  api.post("/generateAccountEntry", generateAccountingEntry, (req, res) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
    });
  });

  return api;
};
