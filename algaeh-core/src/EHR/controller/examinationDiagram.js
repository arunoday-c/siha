import { Router } from "express";
import diagramModels from "../model/examinationDiagram";
import httpStatus from "../../utils/httpStatus";

const {
  examinationDiagramMasterGetter,
  saveExaminationDiagrams,
  existingHeaderDiagramsGetter,
  existingDetailDiagramGetter,
  deleteExaminationDiagramDetailDelete
} = diagramModels;

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
  api.delete(
    "/deleteDiagram",
    deleteExaminationDiagramDetailDelete,
    (req, res) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
      delete req.records;
    }
  );
  return api;
};
