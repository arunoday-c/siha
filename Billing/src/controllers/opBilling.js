import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  newReceiptData,
  addBillData,
  addCashHandover
} from "../models/billing";
import {
  addOpBIlling,
  updateOrderedServicesBilled,
  updateOrderedPackageBilled,
  updateOrderedConsumablessBilled,
  updatePhysiotherapyServices,
  selectBill,
  getPednigBills,
  insertPhysiotherapyServices
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
    updateOrderedServicesBilled,
    updateOrderedConsumablessBilled,
    updateOrderedPackageBilled,
    updatePhysiotherapyServices,
    (req, res, next) => {
      if (
        req.records.PHYSIOTHERAPY != null &&
        req.records.PHYSIOTHERAPY == true
      ) {
        insertPhysiotherapyServices(req, res, next);
      } else {
        next();
      }
    },
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
