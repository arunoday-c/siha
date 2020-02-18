import { Router } from "express";
import utlities from "algaeh-utilities";
import finance_customer from "../models/finance_customer";

const { getCustomerReceivables } = finance_customer;

export default () => {
  const api = Router();

  api.get(
    "/getCustomerReceivables",
    getCustomerReceivables,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records
          })
          .end();
      }
    }
  );

  return api;
};
