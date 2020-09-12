import { Router } from "express";
import utlities from "algaeh-utilities";
import invoiceModels from "../models/invoiceGeneration";
import { bulkInvoiceGeneration } from "../models/bulkinvoiceGeneration";
const {
  getVisitWiseBillDetailS,
  addInvoiceGeneration,
  getInvoicesForClaims,
  getPatientIcdForInvoice,
  getInvoiceGeneration,
  deleteInvoiceIcd,
  addInvoiceIcd,
  updateClaimValidatedStatus,
  updateInvoiceDetails,
  getVisitsForGeneration,
} = invoiceModels;

export default () => {
  let api = Router();

  api.get(
    "/getVisitWiseBillDetailS",
    getVisitWiseBillDetailS,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  api.get(
    "/getVisitsForGeneration",
    getVisitsForGeneration,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  api.post("/addInvoiceGeneration", addInvoiceGeneration, (req, res, next) => {
    let result = req.records;

    if (result.invalid_data == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: result,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
    }

    next();
  });

  api.post("/bulkInvoiceGeneration", bulkInvoiceGeneration, (req, res) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      message: `Generated invoice's succesfull`,
    });
  });

  api.get("/getInvoiceGeneration", getInvoiceGeneration, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getInvoicesForClaims", getInvoicesForClaims, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get(
    "/getPatientIcdForInvoice",
    getPatientIcdForInvoice,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.delete("/deleteInvoiceIcd", deleteInvoiceIcd, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put(
    "/updateClaimValidatedStatus",
    updateClaimValidatedStatus,
    (req, res, next) => {
      let result = req.records;

      if (result.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: result,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: result,
        });
        next();
      }
    }
  );
  api.post("/addInvoiceIcd", addInvoiceIcd, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.put("/updateInvoiceDetails", updateInvoiceDetails, (req, res, next) => {
    let result = req.records;

    if (result.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: result,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
    }

    next();
  });
  return api;
};
