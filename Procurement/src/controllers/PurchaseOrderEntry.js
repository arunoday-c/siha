import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getPurchaseOrderEntry,
  getAuthPurchaseList,
  getPharRequisitionEntryPO,
  getInvRequisitionEntryPO,
  addPurchaseOrderEntry,
  updatePharReqEntry,
  updateInvReqEntry,
  updatePurchaseOrderEntry
} from "../models/PurchaseOrderEntry";
import algaehUtilities from "algaeh-utilities/utilities";

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();

  api.get("/getPurchaseOrderEntry", getPurchaseOrderEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getAuthPurchaseList", getAuthPurchaseList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/getPharRequisitionEntryPO",
    getPharRequisitionEntryPO,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getInvRequisitionEntryPO",
    getInvRequisitionEntryPO,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/addPurchaseOrderEntry",
    addPurchaseOrderEntry,
    (req, res, next) => {
      utilities.logger().log("po_from: ", req.body.po_from);
      if (req.body.po_from == "PHR" && req.body.phar_requisition_id != null) {
        utilities.logger().log("po_from: ", req.body.po_from);
        updatePharReqEntry(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      utilities.logger().log("po_from: ", req.body.po_from);
      if (req.body.po_from == "INV" && req.body.inv_requisition_id != null) {
        utilities.logger().log("po_from: ", req.body.po_from);
        updateInvReqEntry(req, res, next);
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

  api.put(
    "/updatePurchaseOrderEntry",
    updatePurchaseOrderEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
