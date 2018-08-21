import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  physicalExaminationHeader,
  physicalExaminationDetails,
  physicalExaminationSubDetails,
  getPhysicalExamination,
  addOrder,
  addSample,
  addAnalytes,
  addReviewOfSysHeader,
  addReviewOfSysDetails,
  getReviewOfSystem,
  addAllergy,
  getAllergyDetails,
  addChronicalConditions,
  getChronicalConditions,
  addEncounterReview,
  getEncounterReview,
  getMyDay,
  updatdePatEncntrStatus,
  getPatientProfile,
  getChiefComplaints,
  getChiefComplaintsElements,
  addChiefComplaintsElement,
  addPatientChiefComplaints
} from "../model/doctorsWorkBench";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to add  physical_examination_header
  api.post(
    "/physicalExaminationHeader/add",
    physicalExaminationHeader,
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

  // created by irfan : to add  physical_examination_details
  api.post(
    "/physicalExaminationDetails/add",
    physicalExaminationDetails,
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

  // created by irfan : to add  physical_examination_subdetails
  api.post(
    "/physicalExaminationSubDetails/add",
    physicalExaminationSubDetails,
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

  // created by irfan : to get physical examination
  api.get(
    "/getPhysicalExamination/get",
    getPhysicalExamination,
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

  // created by irfan : add order
  api.post(
    "/addOrder",
    addOrder,
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

  // created by irfan : add sample
  api.post(
    "/addSample",
    addSample,
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

  // created by irfan : add analytes
  api.post(
    "/addAnalytes",
    addAnalytes,
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

  // created by irfan : add review_of_system_header
  api.post(
    "/addReviewOfSysHeader",
    addReviewOfSysHeader,
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

  // created by irfan : add review_of_system_details
  api.post(
    "/addReviewOfSysDetails",
    addReviewOfSysDetails,
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

  // created by irfan : to  getReviewOfSystem
  api.get(
    "/getReviewOfSystem",
    getReviewOfSystem,
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

  // created by irfan : add Allergy
  api.post(
    "/addAllergy",
    addAllergy,
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

  // created by irfan : get Allergy details
  api.get(
    "/getAllergyDetails",
    getAllergyDetails,
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

  // created by irfan :  addChronicalConditions
  api.post(
    "/addChronicalConditions",
    addChronicalConditions,
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

  // created by irfan : get ChronicalConditions
  api.get(
    "/getChronicalConditions",
    getChronicalConditions,
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

  // created by irfan :  addEncounterReview
  api.post(
    "/addEncounterReview",
    addEncounterReview,
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

  // created by irfan : get getEncounterReview
  api.get(
    "/getEncounterReview",
    getEncounterReview,
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
    "/getMyDay",
    getMyDay,
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

  api.put(
    "/updatdePatEncntrStatus",
    updatdePatEncntrStatus,
    (req, res, next) => {
      let resultSelect = req.records;
      if (resultSelect.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultSelect
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );

  // created by irfan : to  getPatientProfile
  api.get(
    "/getPatientProfile",
    getPatientProfile,
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
  getChiefComplaints;

  // created by irfan : to  getChiefComplaints
  api.get(
    "/getChiefComplaints",
    getChiefComplaints,
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

  // created by irfan : to  getChiefComplaintsElements
  api.get(
    "/getChiefComplaintsElements",
    getChiefComplaintsElements,
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

  // created by irfan : to add addChiefComplaintsElement
  api.post(
    "/addChiefComplaintsElement",
    addChiefComplaintsElement,
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

  // created by irfan : to add addPatientChiefComplaints
  api.post(
    "/addPatientChiefComplaints",
    addPatientChiefComplaints,
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
