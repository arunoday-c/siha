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
  addPatientChiefComplaints,
  getPatientChiefComplaints,
  addNewChiefComplaint,
  deletePatientChiefComplaints,
  addPatientNewAllergy,
  getAllAllergies,
  getPatientAllergy,
  updatePatientChiefComplaints,
  addPatientDiagnosis,
  getPatientDiagnosis,
  addPatientROS,
  getPatientROS,
  updatePatientROS,
  updatePatientDiagnosis,
  getPatientVitals,
  addPatientVitals
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

  // created by irfan : to add addNewChiefComplaint
  api.post(
    "/addNewChiefComplaint",
    addNewChiefComplaint,
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

  // created by irfan : to  getPatientChiefComplaints
  api.get(
    "/getPatientChiefComplaints",
    getPatientChiefComplaints,
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

  // created by irfan : to  deletePatientChiefComplaints
  api.delete(
    "/deletePatientChiefComplaints",
    deletePatientChiefComplaints,
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

  // created by irfan : to add new allergy for patient
  api.post(
    "/addPatientNewAllergy",
    addPatientNewAllergy,
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

  // created by irfan : to  get all allergies
  api.get(
    "/getAllAllergies",
    getAllAllergies,
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

  // created by irfan : to  get patient wise allergy
  api.get(
    "/getPatientAllergy",
    getPatientAllergy,
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
  // created by irfan : to update patient chief complaints
  api.put(
    "/updatePatientChiefComplaints",
    updatePatientChiefComplaints,
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

  // created by irfan : to add patient Diagnosis
  api.post(
    "/addPatientDiagnosis",
    addPatientDiagnosis,
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
  // created by irfan : to  getPatientDiagnosis
  api.get(
    "/getPatientDiagnosis",
    getPatientDiagnosis,
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

  //created by irfan: to add patient encounter review
  api.post(
    "/addPatientROS",
    addPatientROS,
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

  // created by irfan : to update Patient Diagnosis
  api.put(
    "/updatePatientDiagnosis",
    updatePatientDiagnosis,
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

  // created by irfan : to  getPatientROS
  api.get(
    "/getPatientROS",
    getPatientROS,
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

  //created by irfan: to update Patient ROS
  api.put(
    "/updatePatientROS",
    updatePatientROS,
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

  getPatientVitals;
  // created by irfan : to  getPatientVitals
  api.get(
    "/getPatientVitals",
    getPatientVitals,
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

  //created by irfan: to add patient vitals

  api.post(
    "/addPatientVitals",
    addPatientVitals,
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
