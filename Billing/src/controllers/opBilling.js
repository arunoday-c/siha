import { Router } from "express";
import utlities from "algaeh-utilities";
import { newReceiptData, addBillData } from "../models/billing";
import {
  addOpBIlling,
  updateOrderedServicesBilled,
  selectBill,
  getPednigBills
} from "../models/opBilling";
import { getReceiptEntry } from "../models/receiptentry";

import algaehPath from "algaeh-module-bridge";
const { insertLadOrderedServices, updateLabOrderedBilled } = algaehPath(
  "algaeh-laboratory/src/models/laboratory"
);
const { insertRadOrderedServices, updateRadOrderedBilled } = algaehPath(
  "algaeh-radiology/src/models/radiology"
);

export default () => {
  const api = Router();

  api.post(
    "/addOpBIlling",
    addOpBIlling,
    newReceiptData,
    addBillData,
    updateOrderedServicesBilled,
    updateLabOrderedBilled,
    (req, res, next) => {
      if (req.records.LAB != null && req.records.LAB == true) {
        insertLadOrderedServices(req, res, next);
      } else {
        next();
      }
    },
    updateRadOrderedBilled,
    (req, res, next) => {
      if (req.records.RAD != null && req.records.RAD == true) {
        insertRadOrderedServices(req, res, next);
      } else {
        next();
      }
    },
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
  api.get(
    "/getPednigBills",
    getPednigBills,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
