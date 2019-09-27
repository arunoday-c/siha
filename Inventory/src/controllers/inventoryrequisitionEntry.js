import { Router } from "express";
import utlities from "algaeh-utilities";
import invModels from "../models/inventoryrequisitionEntry";

const {
  addinventoryrequisitionEntry,
  getinventoryrequisitionEntry,
  updateinventoryrequisitionEntry,
  getinventoryAuthrequisitionList
} = invModels;

export default () => {
  const api = Router();
  api.get(
    "/getinventoryrequisitionEntry",
    getinventoryrequisitionEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post(
    "/addinventoryrequisitionEntry",
    addinventoryrequisitionEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateinventoryrequisitionEntry",
    updateinventoryrequisitionEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get(
    "/getinventoryAuthrequisitionList",
    getinventoryAuthrequisitionList,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
