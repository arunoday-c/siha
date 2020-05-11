import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addSalesQuotation,
  getSalesQuotation,
  getSalesQuotationList,
  updateSalesQuotation,
  transferSalesQuotation
} from "../models/SalesQuotation";

export default function SalesQuotation() {
  const api = Router();
  api.post(`/addSalesQuotation`,
    addSalesQuotation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    });

  api.get(
    "/getSalesQuotation",
    getSalesQuotation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getSalesQuotationList",
    getSalesQuotationList,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateSalesQuotation",
    updateSalesQuotation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put(
    "/transferSalesQuotation",
    transferSalesQuotation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  return api;
}
