import { Router } from "express";
import { macro } from "../models/macro";
import utlities from "algaeh-utilities";
export default () => {
  const api = Router();
  api.get("/processAccountingEntry", macro, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        message: "Successfully done",
      })
      .end();
  });
  return api;
};
