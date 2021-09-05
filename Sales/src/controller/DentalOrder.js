import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addDentalOrder,
  getDentalOrder,
  getSalesQuotationForOrder,
  getDentalOrderList,
  updateDentalOrderEntry,
  cancelSalesServiceOrder,
  ValidateContract,
  getContractDentalOrder,
  postDentalOrder,
  rejectSalesServiceOrder,
} from "../models/DentalOrder";

export default function DentalOrder() {
  const api = Router();
  api.post(`/addDentalOrder`, addDentalOrder, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post(`/postDentalOrder`, postDentalOrder, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getDentalOrder", getDentalOrder, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getSalesQuotationForOrder",
    getSalesQuotationForOrder,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getDentalOrderList", getDentalOrderList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateDentalOrderEntry",
    updateDentalOrderEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put(
    "/cancelSalesServiceOrder",
    cancelSalesServiceOrder,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put(
    "/rejectSalesServiceOrder",
    rejectSalesServiceOrder,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/ValidateContract", ValidateContract, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });

  api.get(
    "/getContractDentalOrder",
    getContractDentalOrder,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  return api;
}
