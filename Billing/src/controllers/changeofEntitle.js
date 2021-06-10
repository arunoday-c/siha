import { Router } from "express";
import utlities from "algaeh-utilities";
import { addChangeOfEntitlement } from "../models/changeofEntitle";

export default () => {
  const api = Router();

  api.post(
    "/addChangeOfEntitlement",
    addChangeOfEntitlement,
    (req, res, next) => {
      console.log("req.records", req.records);
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().ok)
          .json({
            success: false,
            result: req.records.message,
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
  return api;
};
