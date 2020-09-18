import { Router } from "express";
import utlities from "algaeh-utilities";
import { reSubmissionDetails, closeClaim } from "../models/resubmission";

export default () => {
  let api = Router();
  api.post("/submit", reSubmissionDetails, (req, res) => {
    const result = req.records;
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: result,
      })
      .end();
    delete req.records;
  });
  api.post("/closeClaim", closeClaim, (req, res) => {
    const result = req.records;
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: result,
      })
      .end();
    delete req.records;
  });
  return api;
};
