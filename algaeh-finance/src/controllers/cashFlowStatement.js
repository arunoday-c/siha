import { Router } from "express";
import utlities from "algaeh-utilities";
import cashFlowStatements, {
  cashFlowStatement,
} from "../models/cashFlowStatement";

const { getCashFlowStatement } = cashFlowStatements;

export default () => {
  const api = Router();

  api.get(
    "/getCashFlowStatement",
    // getCashFlowStatement,
    cashFlowStatement,
    (req, res, next) => {
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
          records: req.records,
        })
        .end();
      // }
    }
  );

  return api;
};
