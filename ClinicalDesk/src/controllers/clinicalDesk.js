import { Router } from "express";
import utlities from "algaeh-utilities";
import { getChiefComplaints } from "../models/clinicalDesk";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to get Patient Mrd List
  api.get(
    "/getChiefComplaints",
    getChiefComplaints,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  return api;
};
