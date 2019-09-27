import { Router } from "express";
import utlities from "algaeh-utilities";
import billModels from "../models/billing";
import opModels from "../models/opBilling";
import recModels from "../models/receiptentry";
// import algaehPath from "algaeh-module-bridge";
import labModels from "algaeh-laboratory/src/models/laboratory";
import radModels from "algaeh-radiology/src/models/radiology";
// const { insertLadOrderedServices, updateLabOrderedBilled } = algaehPath(
//   "algaeh-laboratory/src/models/laboratory"
// );
// const { insertRadOrderedServices, updateRadOrderedBilled } = algaehPath(
//   "algaeh-radiology/src/models/radiology"
// );
//destructuring
const { newReceiptData, addBillData, addCashHandover } = billModels;
const {
  addOpBIlling,
  updateOrderedServicesBilled,
  updateOrderedPackageBilled,
  updateOrderedConsumablessBilled,
  updatePhysiotherapyServices,
  selectBill,
  getPednigBills,
  insertPhysiotherapyServices
} = opModels;
const { getReceiptEntry } = recModels;
const { insertLadOrderedServices, updateLabOrderedBilled } = labModels;
const { insertRadOrderedServices, updateRadOrderedBilled } = radModels;

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
