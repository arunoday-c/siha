import { Router } from "express";
import utlities from "algaeh-utilities";
import finance_customer, {
  getAllCreditNotes,
} from "../models/finance_customer";

const {
  getCustomerReceivables,
  getCustomerInvoiceDetails,
  revrtInvocieBack,
} = finance_customer;

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
            message: req.records.message,
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records,
          })
          .end();
      }
    }
  );
  api.get(
    "/getCustomerInvoiceDetails",
    getCustomerInvoiceDetails,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            message: req.records.message,
          })
          .end();
      } else {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: true,
            result: req.records,
          })
          .end();
      }
    }
  );
  api.put("/revrtInvocieBack", revrtInvocieBack, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });
  api.get("/getAllCreditNotes", getAllCreditNotes, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });
  return api;
};
