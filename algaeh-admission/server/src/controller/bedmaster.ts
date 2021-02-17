// @ts-ignore
import utlities from "algaeh-utilities";
import { getBedStatus } from "../models/bedMaster";
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

  //   api.get(
  //     "/getEmployeeAuthorizationSetup",
  //     getEmployeeAuthorizationSetup,
  //     (req, res, next) => {
  //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //         success: true,
  //         records: req.records,
  //       });
  //     }
  //   );

  //   api.post("/addEmployeeGroups", addEmployeeGroups, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.put("/updateEmployeeGroup", updateEmployeeGroup, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.get("/getDesignations", getDesignations, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   });

  //   api.post("/addDesignation", addDesignation, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.put("/updateDesignation", updateDesignation, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.get("/getOvertimeGroups", getOvertimeGroups, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   });

  //   api.post("/addOvertimeGroups", addOvertimeGroups, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.put("/updateOvertimeGroups", updateOvertimeGroups, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.get("/getDocumentsMaster", getDocumentsMaster, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   });

  //   api.post("/addDocumentType", addDocumentType, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   });

  //   api.put("/updateDocumentType", updateDocumentType, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.get("/getProjects", getProjects, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   });

  //   api.post("/addProject", addProject, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.put("/updateProjects", updateProjects, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.post(
  //     "/addEmployeeAuthorizationSetup",
  //     addEmployeeAuthorizationSetup,
  //     (req, res, next) => {
  //       if (req.records.invalid_input == true) {
  //         res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //           success: false,
  //           result: req.records,
  //         });
  //       } else {
  //         res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //           success: true,
  //           result: req.records,
  //         });
  //       }
  //     }
  //   );
  //   api.get("/getAgency", getAgency, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   });

  //   api.post("/addAgency", addAgency, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  //   api.put("/updateAgency", updateAgency, (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       result: req.records,
  //     });
  //   });

  return api;
};
