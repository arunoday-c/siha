import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehPath from "algaeh-utilities/algaeh-path-format";

import {
  addsalesReturn,
  getsalesReturn,
  updatesalesReturn,
  updatePOSDetail
} from "../models/salesReturn";

import { updateIntoItemLocation } from "../models/commonFunction";
const { addReceiptEntry, getReceiptEntry } = require(algaehPath(
  "algaeh-billing/src/models/receiptentry"
));

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
