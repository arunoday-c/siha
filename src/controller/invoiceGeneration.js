import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  getVisitWiseBillDetailS,
  addInvoiceGeneration,
  getInvoiceGeneration
} from "../model/invoiceGeneration";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add Appointment Status
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

  // created by irfan :to add Appointment Status
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

  return api;
};
