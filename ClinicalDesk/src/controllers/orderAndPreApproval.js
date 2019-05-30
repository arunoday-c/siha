import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import {
  insertInvOrderedServices,
  addProcedureItems
} from "../models/orderAndPreApproval";
import algaehPath from "algaeh-module-bridge";
const { updateIntoInvItemLocation } = algaehPath(
  "algaeh-inventory/src/models/commonFunction"
);

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();

  api.post(
    "/insertInvOrderedServices",
    insertInvOrderedServices,
    updateIntoInvItemLocation,
    (req, res, next) => {
      const _records = req.records;
      res.status(utilities.httpStatus().ok).json({
        success: true,
        records: _records
      });
      delete req.records;
    }
  );
  api.post("/addProcedureItems", addProcedureItems, (req, res, next) => {
    const _records = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _records
    });
    delete req.records;
  });

  return api;
};
