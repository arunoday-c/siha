import { Router } from "express";
import utlities from "algaeh-utilities";
import quick_search from "../models/quick_search";

const { performSearch } = quick_search;

export default () => {
  const api = Router();

  api.get("/performSearch", performSearch, (req, res, next) => {
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
  });
  // api.get(
  //   "/getCustomerInvoiceDetails",
  //   getCustomerInvoiceDetails,
  //   (req, res, next) => {
  //     if (req.records.invalid_input == true) {
  //       res
  //         .status(utlities.AlgaehUtilities().httpStatus().internalServer)
  //         .json({
  //           success: false,
  //           message: req.records.message
  //         })
  //         .end();
  //     } else {
  //       res
  //         .status(utlities.AlgaehUtilities().httpStatus().ok)
  //         .json({
  //           success: true,
  //           result: req.records
  //         })
  //         .end();
  //     }
  //   }
  // );

  return api;
};
