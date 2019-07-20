import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  newReceiptData,
  patientAdvanceRefund,
  billingCalculations,
  getBillDetails,
  getPakageDetails,
  patientPackageAdvanceRefund,
  updatePatientPackage
} from "../models/billing";

import algaehPath from "algaeh-module-bridge";
const { insertLadOrderedServices } = algaehPath(
  "algaeh-laboratory/src/models/laboratory"
);
const { insertRadOrderedServices } = algaehPath(
  "algaeh-radiology/src/models/radiology"
);

export default () => {
  const api = Router();

  api.post(
    "/newReceiptData",
    newReceiptData,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/patientAdvanceRefund",
    patientAdvanceRefund,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.post(
    "/patientPackageAdvanceRefund",
    patientPackageAdvanceRefund,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/billingCalculations",
    billingCalculations,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  // api.post(
  //   "/getBillDetails",
  //   getBillDetails,

  //   (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records
  //     });
  //   }
  // );

  api.get(
    "/getPakageDetails",
    getPakageDetails,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post("/getBillDetails", getBillDetails, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  });

  api.put(
    "/updatePatientPackage",
    updatePatientPackage,
    insertLadOrderedServices,
    insertRadOrderedServices,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
