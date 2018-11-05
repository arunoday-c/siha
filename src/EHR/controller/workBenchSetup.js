import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addVitalMasterHeader,
    addVitalMasterDetail,
    getVitalMasterHeader,
    getVitalMasterDetail}from "../model/workBenchSetup";
  export default ({ config, db }) => {
    let api = Router();
  
    // created by irfan : to add  physical_examination_header
    api.post(
      "/addVitalMasterHeader",
      addVitalMasterHeader,
      (req, res, next) => {
        let result = req.records;
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      },
      releaseConnection
    );

 
    api.get(
      "/getVitalMasterHeader",
      getVitalMasterHeader,
      (req, res, next) => {
        let result = req.records;
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      },
      releaseConnection
    );

    api.post(
      "/addVitalMasterDetail",
      addVitalMasterDetail,
      (req, res, next) => {
        let result = req.records;
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      },
      releaseConnection
    );

    api.get(
      "/getVitalMasterDetail",
      getVitalMasterDetail,
      (req, res, next) => {
        let result = req.records;
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      },
      releaseConnection
    );




    return api;
};