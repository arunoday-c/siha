//Connection Done
import { Router } from "express";
import utlities from "algaeh-utilities";
import orgModels from "../model/organization";

const {
  getOrganization,
  getOrganizationByUser,
  getMainOrganization,
  updateOrganization,
} = orgModels;

export default () => {
  const api = Router();
  api.get("/getOrganization", getOrganization, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
    delete req.records;
  });

  api.get("/getOrganizationByUser", getOrganizationByUser, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
    delete req.records;
  });
  api.get("/getMainOrganization", getMainOrganization, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
    delete req.records;
  });
  api.put("/updateOrganization", updateOrganization, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        message: "Updated Successfully",
      })
      .end();
  });

  return api;
};
