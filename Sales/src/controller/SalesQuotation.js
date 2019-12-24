import { Router } from "express";
import utlities from "algaeh-utilities";
import { addSalesQuotation, getSalesQuotation } from "../models/SalesQuotation";

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
      console.log("Here");
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  return api;
}
