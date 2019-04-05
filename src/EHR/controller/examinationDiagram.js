import { Router } from "express";
import {
  examinationDiagramMasterGetter,
  saveExaminationDiagrams,
  existingHeaderDiagramsGetter,
  existingDetailDiagramGetter
} from "../model/examinationDiagram";
import httpStatus from "../../utils/httpStatus";
export default () => {
  const api = Router();
  api.get("/getMaster", examinationDiagramMasterGetter, (req, res) => {
    const result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
    delete req.records;
  });
  api.get(
    "/getExistingDiagramHeader",
    existingHeaderDiagramsGetter,
    (req, res) => {
      const result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      delete req.records;
    }
  );
  api.get(
    "/getExistingDiagramDetails",
    existingDetailDiagramGetter,
    (req, res) => {
      const result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      delete req.records;
    }
  );
  api.post("/saveDiagram", saveExaminationDiagrams, (req, res) => {
    res.status(httpStatus.ok).json({
      success: true,
      records: req.records
    });
    delete req.records;
  });
  return api;
};
