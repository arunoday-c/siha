import { Router } from "express";
import utlities from "algaeh-utilities";
import pl_comparison from "../models/pl_comparison";

const { getPlComparison } = pl_comparison;

export default () => {
  const api = Router();

  api.get("/getPlComparison", getPlComparison, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
    // }
  });

  return api;
};
