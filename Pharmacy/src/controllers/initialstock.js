import { Router } from "express";
import utlities from "algaeh-utilities";
import { addPharmacyInitialStock } from "../models/initialstock";

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/addPharmacyInitialStock",
    addPharmacyInitialStock,
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
