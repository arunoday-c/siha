import { Router } from "express";
import utlities from "algaeh-utilities";
import { getChiefComplaints } from "../models/clinicalDesk";

export default () => {
  let api = Router();
  api.get("/getChiefComplaints", getChiefComplaints, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
    });
  });

  return api;
};
