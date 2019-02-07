import { Router } from "express";
import utlities from "algaeh-utilities";
import { selectFrontDesk } from "../models/frontDesk";
export default () => {
  const api = Router();
  api.get("/get", selectFrontDesk, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
