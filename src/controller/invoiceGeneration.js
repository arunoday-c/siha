import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  getVisitWiseBillDetailS,
  addInvoiceGeneration,
  getInvoiceGeneration,
  getInvoicesForClaims,
  getPatientIcdForInvoice
} from "../model/invoiceGeneration";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to
  api.get(
    "/getVisitWiseBillDetailS",
    getVisitWiseBillDetailS,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to add
  api.post(
    "/addInvoiceGeneration",
    addInvoiceGeneration,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/getInvoiceGeneration",
    getInvoiceGeneration,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan
  api.get("/getInvoicesForClaims", getInvoicesForClaims, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: "Please Select at least One Criteria"
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.get(
    "/getPatientIcdForInvoice",
    getPatientIcdForInvoice,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "please provide valid input"
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
      next();
    }
  );

  return api;
};
