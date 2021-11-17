import { Router } from "express";
import utlities from "algaeh-utilities";
import mrdModels from "../models/mrd";

const {
  getPatientMrdList,
  getPatientMrd,
  getPatientEncounterDetails,
  getPatientChiefComplaint,
  getPatientDiagnosis,
  getPatientMedication,
  getPatientInvestigation,
  getPatientProcedures,
  getPatientInvestigationForDashBoard,
  getPatientPaymentDetails,
  getPatientTreatments,
  getPatientSummary,
  getPatientAllergyHis,
  getPatientDietHis,
} = mrdModels;

export default () => {
  let api = Router();

  // created by irfan :to get Patient Mrd List
  api.get("/getPatientMrdList", getPatientMrdList, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getPatientMrd", getPatientMrd, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getPatientSummary", getPatientSummary, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  // created by irfan :to get Patient Encounter Details
  api.get(
    "/getPatientEncounterDetails",
    getPatientEncounterDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  // created by irfan :to get Patient Chief Complaint
  api.get(
    "/getPatientChiefComplaint",
    getPatientChiefComplaint,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  // created by irfan :to getPatientDiagnosis
  api.get("/getPatientDiagnosis", getPatientDiagnosis, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  // created by irfan :to getPatientMedication
  api.get("/getPatientMedication", getPatientMedication, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getPatientDietHis", getPatientDietHis, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getPatientAllergyHis", getPatientAllergyHis, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  // created by irfan :to get Patient Investigation
  api.get(
    "/getPatientInvestigation",
    getPatientInvestigation,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.get("/getPatientProcedures", getPatientProcedures, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get(
    "/getPatientInvestigationForDashBoard",
    getPatientInvestigationForDashBoard,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  // created by irfan :to  getPatientPaymentDetails
  api.get(
    "/getPatientPaymentDetails",
    getPatientPaymentDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  // created by irfan :to  getPatientTreatments
  api.get("/getPatientTreatments", getPatientTreatments, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  return api;
};
