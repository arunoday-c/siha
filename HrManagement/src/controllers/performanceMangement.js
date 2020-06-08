import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  insertApprisalMatrixRange,
  getApprisalMatrixRange,
  deleteApprisalMatrixRange,
  addGroupName,
  getGroupName,
  deleteGroupName,
  addQuestionaries,
  getQuestionaries,
  deleteQuestionaries,
} from "../models/performanceManagement";
export default () => {
  const api = Router();
  api.post(
    "/insertApprisalMatrixRange",
    insertApprisalMatrixRange,
    (req, res) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  api.get(
    "/getApprisalMatrixRange",
    getApprisalMatrixRange,
    (req, res, next) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  api.put(
    "/deleteApprisalMatrixRange",
    deleteApprisalMatrixRange,
    (req, res, next) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  api.post("/addGroupName", addGroupName, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });
  api.get("/getGroupName", getGroupName, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
  });
  api.put("/deleteGroupName", deleteGroupName, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
  });
  api.post("/addQuestionaries", addQuestionaries, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });
  api.get("/getQuestionaries", getQuestionaries, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
  });
  api.put("/deleteQuestionaries", deleteQuestionaries, (req, res, next) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
  });

  return api;
};
