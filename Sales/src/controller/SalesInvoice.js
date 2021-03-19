import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getDispatchForInvoice,
  getDispatchItemDetails,
  getSalesOrderServiceInvoice,
  addInvoiceEntry,
  getInvoiceEntry,
  postSalesInvoice,
  generateAccountingEntry,
  revertSalesInvoice,
  CancelSalesInvoice,
  getSalesInvoiceList,
  saveDeliveryDate,
  getInvoiceEntryCash,
} from "../models/SalesInvoice";
import inventoryModel from "algaeh-inventory/src/models/commonFunction";

import { addDispatchNote } from "../models/DispatchNote";
const { updateIntoInvItemLocation } = inventoryModel;

export default function SalesOrder() {
  const api = Router();
  api.get(
    `/getDispatchItemDetails`,
    getDispatchItemDetails,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getDispatchForInvoice", getDispatchForInvoice, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getSalesOrderServiceInvoice",
    getSalesOrderServiceInvoice,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getInvoiceEntry", getInvoiceEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getInvoiceEntryCash", getInvoiceEntryCash, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post(
    "/addInvoiceEntry",
    (req, res, next) => {
      req.connection = null;
      delete req.connection;
      next();
    },
    addInvoiceEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put(
    "/postSalesInvoice",
    postSalesInvoice,
    generateAccountingEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.put("/saveDeliveryDate", saveDeliveryDate, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.put(
    "/generateAccountingEntry",
    generateAccountingEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.put("/revertSalesInvoice", revertSalesInvoice, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.put("/CancelSalesInvoice", CancelSalesInvoice, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getSalesInvoiceList", getSalesInvoiceList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post(
    "/addCashSalesInvoice",
    addDispatchNote,
    addInvoiceEntry,
    updateIntoInvItemLocation,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  return api;
}
