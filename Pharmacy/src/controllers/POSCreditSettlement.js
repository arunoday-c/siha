import { Router } from "express";
import utlities from "algaeh-utilities";
import receiptModels from "algaeh-billing/src/models/receiptentry";
import billModels from "algaeh-billing/src/models/billing";
import posCreditModels from "../models/POSCreditSettlement";

const {
  addPOSCreidtSettlement,
  getPOSCreidtSettlement,
  updatePOSBilling,
  getPatientPOSCriedt
} = posCreditModels;
const { addReceiptEntry, getReceiptEntry } = receiptModels;
const { addCashHandover } = billModels;

export default () => {
  const api = Router();
  api.get(
    "/getPOSCreidtSettlement",
    getPOSCreidtSettlement,
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

  api.post(
    "/addPOSCreidtSettlement",
    addReceiptEntry,
    addPOSCreidtSettlement,
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
    updatePOSBilling,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getPatientPOSCriedt", getPatientPOSCriedt, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
