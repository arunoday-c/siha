import { Router } from "express";
import utlities from "algaeh-utilities";
import salesModels from "../models/salesReturn";
import receiptModels from "algaeh-billing/src/models/receiptentry";
import comModels from "../models/commonFunction";
const { addReceiptEntry, getReceiptEntry } = receiptModels;

const {
  addsalesReturn,
  getsalesReturn,
  updatesalesReturn,
  updatePOSDetail,
  generateAccountingEntry
} = salesModels;

const { updateIntoItemLocation } = comModels;

export default () => {
  const api = Router();
  api.get(
    "/getsalesReturn",
    getsalesReturn,
    getReceiptEntry,
    (req, res, next) => {
      let _receptEntry = req.receptEntry;
      let _sales = req.records;

      let result = { ..._receptEntry, ..._sales };

      delete req.receptEntry;
      delete req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
    }
  );

  api.post(
    "/addsalesReturn",
    addReceiptEntry,
    addsalesReturn,
    updatePOSDetail,
    generateAccountingEntry,
    updateIntoItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put("/updatesalesReturn", updatesalesReturn, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
