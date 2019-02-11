import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  selectFrontDesk,
  addFrontDesk,
  updateFrontDesk
} from "../models/frontDesk";
import { insertPatientData } from "../models/patientRegistration";
import algaehPath from "algaeh-utilities/algaeh-path-format";
import {
  insertPatientVisitData,
  addPatientInsuranceData,
  addEpisodeEncounterData
} from "../models/visit";

const { newReceiptData, addBillData } = require(algaehPath(
  "algaeh-billing/src/models/billing"
));

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
