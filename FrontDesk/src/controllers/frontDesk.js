import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  selectFrontDesk,
  addFrontDesk,
  updateFrontDesk
} from "../models/frontDesk";
import { insertPatientData } from "../models/patientRegistration";
import {
  insertPatientVisitData,
  addPatientInsuranceData,
  addEpisodeEncounterData
} from "../models/visit";
// import algaehPath from "algaeh-utilities/algaeh-path-format";
import { addBillData, newReceiptData } from "algaeh-billing/src/models/billing";
// const { addBillData, newReceiptData } = require(algaehPath(
//   "algaeh-billing/src/model/billing"
// ));

// const { addBillData, newReceiptData } = require(algaehPath(
//   "algaeh-billing/src/model/billing"
// ));

export default () => {
  const api = Router();
  api.get("/get", selectFrontDesk, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post(
    "/add",
    addFrontDesk,
    insertPatientData,
    insertPatientVisitData,
    addPatientInsuranceData,
    newReceiptData,
    addBillData,
    addEpisodeEncounterData,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/update",
    updateFrontDesk,
    insertPatientVisitData,
    addPatientInsuranceData,
    newReceiptData,
    addBillData,
    addEpisodeEncounterData,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
