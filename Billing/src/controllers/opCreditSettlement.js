import { Router } from "express";
import utlities from "algaeh-utilities";
import opCreditModels from "../models/opCreditSettlement";
import billModels from "../models/billing";
import recModels from "../models/receiptentry";

const {
  addCreidtSettlement,
  getCreidtSettlement,
  updateOPBilling,
  getPatientwiseBill,
  addCreditToDayEnd
} = opCreditModels;

const { addCashHandover } = billModels;
const { getReceiptEntry, addReceiptEntry } = recModels;

export default () => {
  const api = Router();

  api.post(
    "/addCreidtSettlement",
    addReceiptEntry,
    addCreidtSettlement,
    addCashHandover,
    (req, res, next) => {
      if (
        req.records.internal_error != undefined &&
        req.records.internal_error == true
      ) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,

          records: {
            internal_error: req.records.internal_error,
            message: req.records.message
          }
        });
      } else {
        next();
      }
    },
    addCreditToDayEnd,
    updateOPBilling,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getCreidtSettlement",
    getCreidtSettlement,
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

  api.get(
    "/getPatientwiseBill",
    (req, res, next) => {
      delete req.connection;
      next();
    },
    getPatientwiseBill,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
