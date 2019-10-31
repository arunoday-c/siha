import { Router } from "express";
import utlities from "algaeh-utilities";
import models from "../models/billing";
import labModels from "algaeh-laboratory/src/models/laboratory";
import radModels from "algaeh-radiology/src/models/radiology";

//this stuff will be removed if i did succeed
// import algaehPath from "algaeh-module-bridge";
// const { insertLadOrderedServices } = algaehPath(
//   "algaeh-laboratory/src/models/laboratory"
// );
// const { insertRadOrderedServices } = algaehPath(
//   "algaeh-radiology/src/models/radiology"
// );

const {
  newReceiptData,
  patientAdvanceRefund,
  billingCalculations,
  getBillDetails,
  getPakageDetails,
  patientPackageAdvanceRefund,
  updatePatientPackage,
  getEmployeeAndDepartments,
  closePackage,
  addCashHandover,
  addtoDayEnd
} = models;

const { insertLadOrderedServices } = labModels;
const { insertRadOrderedServices } = radModels;

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
    addtoDayEnd,
    addCashHandover,
    (req, res, next) => {
      if (
        req.records.internal_error != undefined &&
        req.records.internal_error == true
      ) {
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
    (req, res, next) => {
      delete req.connection;
      next();
    },
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

  api.get(
    "/getEmployeeAndDepartments",
    getEmployeeAndDepartments,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put("/closePackage", closePackage, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
