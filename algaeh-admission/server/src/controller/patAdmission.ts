// @ts-ignore
import utlities from "algaeh-utilities";
import { addPatienAdmission } from "../models/patAdmission";
import { Router, Request, Response, NextFunction } from "express";
// const { getBedStatus } = bedMaster;
interface newRequest extends Request {
  records?: any;
}
export default () => {
  const api = Router();
  api.post(
    "/addPatienAdmission",
    addPatienAdmission,
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
