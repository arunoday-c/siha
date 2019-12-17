//Connection Done
import { Router } from "express";
import utlities from "algaeh-utilities";
import orgModels from "../model/organization";

const { getOrganization, getOrganizationByUser } = orgModels;

export default () => {
  const api = Router();
  api.get("/getOrganization", getOrganization, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getOrganizationByUser", getOrganizationByUser, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
