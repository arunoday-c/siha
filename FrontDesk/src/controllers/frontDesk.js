import { Router } from "express";
import utlities from "algaeh-utilities";
import { selectFrontDesk, addFrontDesk } from "../models/frontDesk";
// import { insertPatientData } from "../models/patientRegistration";
// import { insertPatientVisitData } from "../models/visit";
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
    //insertPatientData,
    //insertPatientVisitData,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
