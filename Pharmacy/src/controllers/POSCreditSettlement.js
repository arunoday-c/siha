import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehPath from "algaeh-module-bridge";

import {
  addPOSCreidtSettlement,
  getPOSCreidtSettlement,
  updatePOSBilling,
  getPatientPOSCriedt
} from "../models/POSCreditSettlement";

const { addReceiptEntry, getReceiptEntry } = algaehPath(
  "algaeh-billing/src/models/receiptentry"
);
const { addCashHandover } = algaehPath("algaeh-billing/src/models/billing");
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
