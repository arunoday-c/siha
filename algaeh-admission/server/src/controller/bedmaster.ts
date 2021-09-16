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
  bedStatusSetUp,
  updateBedStatus,
  updateBedReleasingDetails,
  getPatBedAdmissionDetails,
  addBedStatus,
  getWardHeader,
  onDeleteBedStatus,
  updateBedStatusUnavailable,
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
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  api.delete(
    "/deleteBedStatus",
    deleteBedStatus,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );

  api.post(
    "/AddNewBedType",
    AddNewBedType,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  api.put(
    "/updateBedType",
    updateBedType,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );
  api.put(
    "/updateBedStatusUnavailable",
    updateBedStatusUnavailable,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  api.put(
    "/updateBedReleasingDetails",
    updateBedReleasingDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
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
    "/getPatBedAdmissionDetails",
    getPatBedAdmissionDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  api.get(
    "/getWardHeader",
    getWardHeader,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  getWardHeader;
  api.get(
    "/getWardDetails",
    getWardDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  api.delete(
    "/onDeleteDetails",
    onDeleteDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );

  api.post(
    "/addWardDetails",
    addWardDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  api.put(
    "/updateWardDetails",
    updateWardDetails,
    (req: newRequest, res: Response, next: NextFunction) => {
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
    "/getWardHeaderData",
    getWardHeaderData,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  api.delete(
    "/onDeleteHeader",
    onDeleteHeader,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );

  api.post(
    "/addWardHeader",
    addWardHeader,
    (req: newRequest, res: Response) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  api.put(
    "/updateWardHeader",
    updateWardHeader,
    (req: newRequest, res: Response, next: NextFunction) => {
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
    "/getBedService",
    getBedService,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );

  api.get(
    "/bedDataFromMaster",
    bedDataFromMaster,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );
  api.get(
    "/bedStatusSetUp",
    bedStatusSetUp,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  );

  api.post("/addBedStatus", addBedStatus, (req: newRequest, res: Response) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        result: req.records,
      })
      .end();
  });

  api.put(
    "/onDeleteBedStatus",
    onDeleteBedStatus,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );

  api.put(
    "/updateBedStatus",
    updateBedStatus,
    (req: newRequest, res: Response, next: NextFunction) => {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          result: req.records,
        })
        .end();
    }
  );
  return api;
};
