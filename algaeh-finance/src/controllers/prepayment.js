import { Router } from "express";
import {
  getPrepaymentTypes,
  createPrepaymentTypes,
  updatePrepaymentTypes,
  deletePrepaymentTypes,
} from "../models/prepayment";
import utlities from "algaeh-utilities";

export default () => {
  const api = Router();
  api.get("/getPrepaymentTypes", getPrepaymentTypes, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });
  api.post(
    "/createPrepaymentTypes",
    createPrepaymentTypes,
    (req, res, next) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  api.put("/updatePrepaymentTypes", updatePrepaymentTypes, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });

  api.delete(
    "/deletePrepaymentTypes",
    deletePrepaymentTypes,
    (req, res, next) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  return api;
};
