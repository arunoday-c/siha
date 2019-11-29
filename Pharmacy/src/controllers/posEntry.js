import { Router } from "express";
import utlities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
import posEntryModels from "../models/posEntry";
import comModels from "../models/commonFunction";
import billModels from "algaeh-billing/src/models/billing";
import receiptModels from "algaeh-billing/src/models/receiptentry";
// import s from "algaeh-billing/src/models/receiptentry"
const { addReceiptEntry, getReceiptEntry } = receiptModels;
const { addCashHandover } = billModels;

const {
  getPosEntry,
  addPosEntry,
  updatePosEntry,
  getPrescriptionPOS,
  cancelPosEntry,
  insertPreApprovalOutsideCustomer,
  updatePOSDetailForPreApproval
} = posEntryModels;

const { updateIntoItemLocation } = comModels;

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();

  api.get(
    "/getPosEntry",
    getPosEntry,
    (req, res, next) => {
      if (req.records.hims_f_receipt_header_id != undefined) {
        getReceiptEntry(req, res, next);
      } else {
        utilities.logger().log("Outside: ");

        req.receptEntry = { receiptdetails: [] };
        utilities.logger().log("po_from: ", req.receptEntry);
        next();
      }
    },
    (req, res, next) => {
      let _receptEntry = req.receptEntry;
      let _pos = req.records;
      let result = { ..._receptEntry, ..._pos };

      delete req.receptEntry;
      delete req.pos;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
    }
  );

  api.post(
    "/addPosEntry",
    (req, res, next) => {
      delete req.connection;
      next();
    },
    addPosEntry,

    (req, res, next) => {
      // utilities.logger().log("pos_customer_type: ", req.body.pos_customer_type);
      // utilities.logger().log("pre_approval_req: ", req.body.pre_approval_req);
      console.log("visit_preapproval: ", req.body.visit_preapproval);
      if (
        (req.body.pos_customer_type == "OT" &&
          req.body.pre_approval_req == "Y") || (req.body.visit_preapproval === "Y")
      ) {
        console.log("if data: ");
        insertPreApprovalOutsideCustomer(req, res, next);
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

  api.post("/getPrescriptionPOS", getPrescriptionPOS, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post(
    "/addandpostPosEntry",
    addReceiptEntry,
    addPosEntry,
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
    updateIntoItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updatePosEntry",
    (req, res, next) => {
      delete req.connection;
      next();
    },
    updatePosEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/postPosEntry",
    addReceiptEntry,
    updatePosEntry,
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
    updateIntoItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put("/cancelPosEntry", cancelPosEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put(
    "/updatePOSDetailForPreApproval",
    updatePOSDetailForPreApproval,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
