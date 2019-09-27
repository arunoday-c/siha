import { Router } from "express";
import utlities from "algaeh-utilities";
import physioModels from "../models/physiotherapy";
const { getPhysiotherapyTreatment, savePhysiotherapyTreatment } = physioModels;

export default () => {
  const api = Router();

  api.get(
    "/getPhysiotherapyTreatment",
    getPhysiotherapyTreatment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/savePhysiotherapyTreatment",
    savePhysiotherapyTreatment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
