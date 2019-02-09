import { Router } from "express";
import utlities from "algaeh-utilities";
import { newReceiptData, addBillData } from "../models/billing";
import {
  addOpBIlling,
  updateOrderedServicesBilled,
  selectBill
} from "../models/opBilling";
import { getReceiptEntry } from "../models/receiptentry";

import algaehPath from "algaeh-utilities/algaeh-path-format";
const { insertLadOrderedServices } = require(algaehPath(
  "algaeh-laboratory/src/models/laboratory"
));
const { insertRadOrderedServices } = require(algaehPath(
  "algaeh-radiology/src/models/radiology"
));

export default () => {
  const api = Router();

  api.post(
    "/addOpBIlling",
    addOpBIlling,
    newReceiptData,
    addBillData,
    updateOrderedServicesBilled,
    insertLadOrderedServices,
    insertRadOrderedServices,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/get",
    selectBill,
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
