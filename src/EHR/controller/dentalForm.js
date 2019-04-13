import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import {
 addDentalForm
} from "../model/dentalForm";
export default () => {
  const api = Router();
  const utilities = new algaehUtilities();


  api.post(
    "/addDentalForm",
    addDentalForm,
    (req, res, next) => {
      let result = req.records;
      res.status(utilities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  return api;
};
