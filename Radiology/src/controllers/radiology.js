import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getRadOrderedServices,
  updateRadOrderedServices,
  getRadTemplateList
} from "../models/radiology";

export default () => {
  const api = Router();
  api.get("/getRadOrderedServices", getRadOrderedServices, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
      user_id: req.userIdentity.algaeh_d_app_user_id
    });
  });

  api.put(
    "/updateRadOrderedServices",
    updateRadOrderedServices,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getRadTemplateList", getRadTemplateList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
