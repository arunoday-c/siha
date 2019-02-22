import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehPath from "algaeh-utilities/algaeh-path-format";

import {
  addPOSCreidtSettlement,
  getPOSCreidtSettlement,
  updatePOSBilling,
  getPatientPOSCriedt
} from "../models/POSCreditSettlement";

const { addReceiptEntry, getReceiptEntry } = require(algaehPath(
  "algaeh-billing/src/models/receiptentry"
));

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
