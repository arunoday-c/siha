import { Router } from "express";
import utlities from "algaeh-utilities";
import { addChangeOfEntitlement } from "../models/changeofEntitle";

export default () => {
  const api = Router();

  api.post(
    "/addChangeOfEntitlement",
    addChangeOfEntitlement,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  return api;
};
