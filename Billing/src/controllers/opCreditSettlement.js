import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addCreidtSettlement,
  getCreidtSettlement,
  updateOPBilling,
  getPatientwiseBill
} from "../models/opCreditSettlement";
import { addCashHandover } from "../models/billing";

import { getReceiptEntry, addReceiptEntry } from "../models/receiptentry";

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
