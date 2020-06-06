import { Router } from "express";
import utlities from "algaeh-utilities";
import cashFlowStatement from "../models/cashFlowStatement";

const { getCashFlowStatement } = cashFlowStatement;

export default () => {
  const api = Router();

  api.get("/getCashFlowStatement", getCashFlowStatement, (req, res, next) => {
    // if (req.records.invalid_input == true) {
    //   res
    //     .status(utlities.AlgaehUtilities().httpStatus().internalServer)
    //     .json({
    //       success: false,
    //       message: req.records.message,
    //     })
    //     .end();
    // } else {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
    // }
  });

  return api;
};
