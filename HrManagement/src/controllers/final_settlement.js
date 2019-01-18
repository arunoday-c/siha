import { Router } from "express";
import utlities from "algaeh-utilities";
import { finalSettlement } from "../models/final_settlement";
export default () => {
  const api = Router();
  api.get("/", finalSettlement, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
