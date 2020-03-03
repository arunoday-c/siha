import { Router } from "express";
import finance_supplier from "../models/finance_supplier";
import utlities from "algaeh-utilities";

const { getSupplierPayables, getSupplierInvoiceDetails } = finance_supplier;

export default () => {
  const api = Router();

  api.get("/getSupplierPayables", getSupplierPayables, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().internalServer)
        .json({
          success: false,
          message: req.records.message
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records
        })
        .end();
    }
  });
  api.get(
    "/getSupplierInvoiceDetails",
    getSupplierInvoiceDetails,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records
          })
          .end();
      }
    }
  );

  return api;
};
