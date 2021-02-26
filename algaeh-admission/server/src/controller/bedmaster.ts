// @ts-ignore
import utlities from "algaeh-utilities";
import {
  getBedStatus,
  updateBedType,
  AddNewBedType,
  deleteBedStatus,
  getWardDetails,
  addWardDetails,
  updateWardDetails,
  onDeleteDetails,
  getWardHeaderData,
  addWardHeader,
  onDeleteHeader,
  updateWardHeader,
  getBedService,
  bedDataFromMaster,
} from "../models/bedMaster";
import { Router, Request, Response, NextFunction } from "express";
// const { getBedStatus } = bedMaster;
interface newRequest extends Request {
  records?: any;
}
export default () => {
  const api = Router();
  api.get(
    "/getBedStatus",
    getBedStatus,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.delete(
    "/deleteBedStatus",
    deleteBedStatus,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/AddNewBedType",
    AddNewBedType,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  api.put(
    "/updateBedType",
    updateBedType,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  api.get(
    "/getWardDetails",
    getWardDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.delete(
    "/onDeleteDetails",
    onDeleteDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/addWardDetails",
    addWardDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  api.put(
    "/updateWardDetails",
    updateWardDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  api.get(
    "/getWardHeaderData",
    getWardHeaderData,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.delete(
    "/onDeleteHeader",
    onDeleteHeader,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/addWardHeader",
    addWardHeader,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  api.put(
    "/updateWardHeader",
    updateWardHeader,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  api.get(
    "/getBedService",
    getBedService,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get(
    "/bedDataFromMaster",
    bedDataFromMaster,
    (req: newRequest, res: Response, next: NextFunction) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  return api;
};
