import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import workBenchModels, {
  addNurseNote,
  getNurseNotes,
  deleteNurseNote,
  updateNurseNote,
} from "../model/doctorsWorkBench";
import { getChronic, addOrUpdateChronic } from "../model/chronics";
const {
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
  addPatientVitals,
  addPatientPhysicalExamination,
  updatePatientAllergy,
  addDietAdvice,
  getEpisodeDietAdvice,
  addReferalDoctor,
  addFollowUp,
  getPatientPhysicalExamination,
  updatePatientPhysicalExam,
  getPatientAllergies,
  getPatientDiet,
  getAllPhysicalExamination,
  getVitalsHeaderMaster,
  addPatientHistory,
  updatePatientHistory,
  deletePatientHistory,
  getPatientHistory,
  getFollowUp,
  getPatientEpisodeSummary,
  updatePatientEncounter,
  getPatientEncounter,
  getPatientBasicChiefComplaints,
  deleteDietAdvice,
  getSummaryFollowUp,
  addSickLeave,
  updateSickLeave,
  getSickLeave,
  getActiveEncounters,
  updateAllergy,
  deleteAllergy,
  checkFollowUPofVisit,
  updateSameFollowUp,
  getAllPatientFollowUp,
  getPatientReferralDoc,
  addICDMaster,
  getICDMaster,
  getPatientCount,
  getAllPatientFollowUpDash,
  getDoctorDashboardData,
} = workBenchModels;
const { releaseConnection } = utils;

export default () => {
  let api = Router();

  // created by irfan : to add  physical_examination_header
  api.post(
    "/physicalExaminationHeader/add",
    physicalExaminationHeader,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getPatientCount",
    getPatientCount,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getAllPatientFollowUpDash",
    getAllPatientFollowUpDash,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getDoctorDashboardData",
    getDoctorDashboardData,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getPatientReferralDoc",
    getPatientReferralDoc,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getICDMaster",
    getICDMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getAllPatientFollowUp",
    getAllPatientFollowUp,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/checkFollowUPofVisit",
    checkFollowUPofVisit,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getPhysicalExamination/getAllDepartmentBased",
    getAllPhysicalExamination,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.put(
    "/updateSameFollowUp",
    updateSameFollowUp,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  // created by irfan : add Allergy
  api.post("/addAllergy", addAllergy, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/addICDMaster", addICDMaster, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put("/updatePatientHistory", updatePatientHistory, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put("/updateAllergy", updateAllergy, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.delete("/deleteAllergy", deleteAllergy, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result,
    });
    next();
  });

  // created by irfan : get Allergy details
  api.get(
    "/getAllergyDetails",
    getAllergyDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
          records: resultSelect,
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
        records: result,
      });
      next();
    },
    releaseConnection
  );
  // getChiefComplaints;

  // created by irfan : to  getChiefComplaints
  api.get(
    "/getChiefComplaints",
    getChiefComplaints,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
        records: result,
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
          records: resultSelect,
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
        records: result,
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
        records: result,
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
          records: resultSelect,
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
        records: result,
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
          records: resultSelect,
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );

  // getPatientVitals;
  // created by irfan : to  getPatientVitals
  api.get(
    "/getPatientVitals",
    getPatientVitals,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to add patient physical examination

  api.post(
    "/addPatientPhysicalExamination",
    addPatientPhysicalExamination,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to update  PatientAllergy
  api.put(
    "/updatePatientAllergy",
    updatePatientAllergy,
    (req, res, next) => {
      let resultSelect = req.records;
      if (resultSelect.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultSelect,
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );

  // created by nowshad : to add  diet Advice
  api.post(
    "/addDietAdvice",
    addDietAdvice,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad : to  Diet Details for selcted Episode
  api.get(
    "/getEpisodeDietAdvice",
    getEpisodeDietAdvice,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad : to  add Referal Doctor
  api.post(
    "/addReferalDoctor",
    addReferalDoctor,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad : to  add Follow up
  api.post(
    "/addFollowUp",
    addFollowUp,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by:irfan,to get Patient physical examination
  api.get(
    "/getPatientPhysicalExamination",
    getPatientPhysicalExamination,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to update or delete Patient physical examination
  api.put(
    "/updatePatientPhysicalExam",
    updatePatientPhysicalExam,
    (req, res, next) => {
      let resultSelect = req.records;
      if (resultSelect.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultSelect,
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );
  //created by irfan: to  get Patient Allergies
  api.get(
    "/getPatientAllergies",
    getPatientAllergies,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to  getPatientDiagnosis
  api.get(
    "/getPatientDiagnosis",
    getPatientDiagnosis,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to  getPatientDiet
  api.get(
    "/getPatientDiet",
    getPatientDiet,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to  getVitalsHeaderMaster
  api.get(
    "/getVitalsHeaderMaster",
    getVitalsHeaderMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to  addPatientHistory
  api.post(
    "/addPatientHistory",
    addPatientHistory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by irfan: to  getPatientHistory
  api.get(
    "/getPatientHistory",
    getPatientHistory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by Nowshad: to  get Follow up Recall
  api.get(
    "/getFollowUp",
    getFollowUp,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by Nowshad: to
  api.get(
    "/getPatientEpisodeSummary",
    getPatientEpisodeSummary,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by Nowshad: to Update Notes in Patient encounter
  api.put(
    "/updatePatientEncounter",
    updatePatientEncounter,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by Nowshad: to Get Notes in Patient encounter
  api.get(
    "/getPatientEncounter",
    getPatientEncounter,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  // created by nowshad : to  getPatientBasicChiefComplaints
  api.get(
    "/getPatientBasicChiefComplaints",
    getPatientBasicChiefComplaints,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by Nowshad: to Delete DIET Advice
  api.delete(
    "/deleteDietAdvice",
    deleteDietAdvice,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.delete(
    "/deletePatientHistory",
    deletePatientHistory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by Nowshad: to Delete DIET Advice
  api.get(
    "/getSummaryFollowUp",
    getSummaryFollowUp,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //created by Nowshad:
  api.post(
    "/addSickLeave",
    addSickLeave,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.put("/updateSickLeave", updateSickLeave, (req, res, next) => {
    let result = req.records;
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        records: result,
      })
      .end();
  });
  //created by Nowshad:
  api.get(
    "/getSickLeave",
    getSickLeave,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );

  //To get active encounter by provider
  api.get("/getActiveEncounters", getActiveEncounters, (req, res) => {
    const result = req.records;
    delete req.records;
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        records: result,
      })
      .end();
  });

  api.get("/getNurseNotes", getNurseNotes, (req, res, next) => {
    let result = req.records;
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        records: result,
      })
      .end();
  });

  api.post("/addNurseNote", addNurseNote, (req, res, next) => {
    let result = req.records;
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        records: result,
      })
      .end();
  });
  api.put("/updateNurseNote", updateNurseNote, (req, res, next) => {
    let result = req.records;
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        records: result,
      })
      .end();
  });
  api.delete("/deleteNurseNote", deleteNurseNote, (req, res, next) => {
    let result = req.records;
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        records: result,
      })
      .end();
  });
  api.get("/getChronic", getChronic, (req, res) => {
    let result = req.records;
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        records: result,
      })
      .end();
  });
  api.post("/addChronic", addOrUpdateChronic, (req, res) => {
    res
      .status(httpStatus.ok)
      .json({
        success: true,
        message: "Done",
      })
      .end();
  });
  return api;
};
