import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import {
  getEmployeeDepenedents,
  getCompanyDependents,
  getDocumentTypes,
  saveDocument
} from "../models/employee_documents";

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();
  api.get("/employeeDependents", getEmployeeDepenedents, (req, res, next) => {
    const _result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _result
    });
    delete req.records;
  });
  api.get("/companyDependents", getCompanyDependents, (req, res, next) => {
    const _result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _result
    });
    delete req.records;
  });
  api.get("/types", getDocumentTypes, (req, res, next) => {
    const _result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _result
    });
    delete req.records;
  });
  api.post("/save", saveDocument, (req, res, next) => {
    const _result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: _result
    });
    delete req.records;
  });
  return api;
};
