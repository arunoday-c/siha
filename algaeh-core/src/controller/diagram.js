import { Router } from "express";
import httpStatus from "../utils/httpStatus";

import diagramModels from "../model/diagram";

const {
  addDiagram,
  getDiagrams,
  addDiagramFromMaster,
  getSavedSubSpecialityDiagram,
  updateDiagram,
  deleteDiagram,
  deleteDiagramDetails,
} = diagramModels;

export default ({ config, db }) => {
  let api = Router();

  api.post("/addDiagram", addDiagram, (req, res, next) => {
    let result = req.records;
    if (result.invalidInput == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: result,
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
    }
    next();
  });
  api.post("/addDiagramFromMaster", addDiagramFromMaster, (req, res) => {
    res.status(httpStatus.ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get(
    "/getSavedSubSpecialityDiagram",
    getSavedSubSpecialityDiagram,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });

      next();
    }
  );
  api.get("/getDiagrams", getDiagrams, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result,
    });

    next();
  });

  api.put("/updateDiagram", updateDiagram, (req, res, next) => {
    let result = req.records;
    if (result.invalidInput == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: result,
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
    }
    next();
  });
  api.delete("/deleteDiagram", deleteDiagram, (req, res, next) => {
    let result = req.records;
    if (result.invalidInput == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: result,
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
    }
    next();
  });
  api.delete(
    "/deleteDiagramDetails",
    deleteDiagramDetails,
    (req, res, next) => {
      let result = req.records;

      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });

      next();
    }
  );

  return api;
};
