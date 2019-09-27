import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import orderModels from "../models/orderAndPreApproval";
const { insertInvOrderedServices, addProcedureItems } = orderModels;
import comModels from "algaeh-inventory/src/models/commonFunction";
const { updateIntoInvItemLocation } = comModels;

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();

  api.post(
    "/insertInvOrderedServices",
    insertInvOrderedServices,
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
