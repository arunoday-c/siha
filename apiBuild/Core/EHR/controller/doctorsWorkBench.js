"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _doctorsWorkBench = require("../model/doctorsWorkBench");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan : to add  physical_examination_header
  api.post("/physicalExaminationHeader/add", _doctorsWorkBench.physicalExaminationHeader, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add  physical_examination_details
  api.post("/physicalExaminationDetails/add", _doctorsWorkBench.physicalExaminationDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add  physical_examination_subdetails
  api.post("/physicalExaminationSubDetails/add", _doctorsWorkBench.physicalExaminationSubDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to get physical examination
  api.get("/getPhysicalExamination/get", _doctorsWorkBench.getPhysicalExamination, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getPhysicalExamination/getAllDepartmentBased", _doctorsWorkBench.getAllPhysicalExamination, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan : add order
  api.post("/addOrder", _doctorsWorkBench.addOrder, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : add sample
  api.post("/addSample", _doctorsWorkBench.addSample, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : add analytes
  api.post("/addAnalytes", _doctorsWorkBench.addAnalytes, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : add review_of_system_header
  api.post("/addReviewOfSysHeader", _doctorsWorkBench.addReviewOfSysHeader, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : add review_of_system_details
  api.post("/addReviewOfSysDetails", _doctorsWorkBench.addReviewOfSysDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to  getReviewOfSystem
  api.get("/getReviewOfSystem", _doctorsWorkBench.getReviewOfSystem, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : add Allergy
  api.post("/addAllergy", _doctorsWorkBench.addAllergy, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : get Allergy details
  api.get("/getAllergyDetails", _doctorsWorkBench.getAllergyDetails, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :  addChronicalConditions
  api.post("/addChronicalConditions", _doctorsWorkBench.addChronicalConditions, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : get ChronicalConditions
  api.get("/getChronicalConditions", _doctorsWorkBench.getChronicalConditions, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :  addEncounterReview
  api.post("/addEncounterReview", _doctorsWorkBench.addEncounterReview, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : get getEncounterReview
  api.get("/getEncounterReview", _doctorsWorkBench.getEncounterReview, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.get("/getMyDay", _doctorsWorkBench.getMyDay, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  api.put("/updatdePatEncntrStatus", _doctorsWorkBench.updatdePatEncntrStatus, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  // created by irfan : to  getPatientProfile
  api.get("/getPatientProfile", _doctorsWorkBench.getPatientProfile, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  _doctorsWorkBench.getChiefComplaints;

  // created by irfan : to  getChiefComplaints
  api.get("/getChiefComplaints", _doctorsWorkBench.getChiefComplaints, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add addPatientChiefComplaints
  api.post("/addPatientChiefComplaints", _doctorsWorkBench.addPatientChiefComplaints, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add addNewChiefComplaint
  api.post("/addNewChiefComplaint", _doctorsWorkBench.addNewChiefComplaint, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to  getPatientChiefComplaints
  api.get("/getPatientChiefComplaints", _doctorsWorkBench.getPatientChiefComplaints, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to  deletePatientChiefComplaints
  api.delete("/deletePatientChiefComplaints", _doctorsWorkBench.deletePatientChiefComplaints, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to add new allergy for patient
  api.post("/addPatientNewAllergy", _doctorsWorkBench.addPatientNewAllergy, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to  get all allergies
  api.get("/getAllAllergies", _doctorsWorkBench.getAllAllergies, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to  get patient wise allergy
  api.get("/getPatientAllergy", _doctorsWorkBench.getPatientAllergy, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);
  // created by irfan : to update patient chief complaints
  api.put("/updatePatientChiefComplaints", _doctorsWorkBench.updatePatientChiefComplaints, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  // created by irfan : to add patient Diagnosis
  api.post("/addPatientDiagnosis", _doctorsWorkBench.addPatientDiagnosis, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to add patient encounter review
  api.post("/addPatientROS", _doctorsWorkBench.addPatientROS, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan : to update Patient Diagnosis
  api.put("/updatePatientDiagnosis", _doctorsWorkBench.updatePatientDiagnosis, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  // created by irfan : to  getPatientROS
  api.get("/getPatientROS", _doctorsWorkBench.getPatientROS, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to update Patient ROS
  api.put("/updatePatientROS", _doctorsWorkBench.updatePatientROS, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  _doctorsWorkBench.getPatientVitals;
  // created by irfan : to  getPatientVitals
  api.get("/getPatientVitals", _doctorsWorkBench.getPatientVitals, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to add patient vitals

  api.post("/addPatientVitals", _doctorsWorkBench.addPatientVitals, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to add patient physical examination

  api.post("/addPatientPhysicalExamination", _doctorsWorkBench.addPatientPhysicalExamination, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to update  PatientAllergy
  api.put("/updatePatientAllergy", _doctorsWorkBench.updatePatientAllergy, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);

  // created by nowshad : to add  diet Advice
  api.post("/addDietAdvice", _doctorsWorkBench.addDietAdvice, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad : to  Diet Details for selcted Episode
  api.get("/getEpisodeDietAdvice", _doctorsWorkBench.getEpisodeDietAdvice, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad : to  add Referal Doctor
  api.post("/addReferalDoctor", _doctorsWorkBench.addReferalDoctor, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by Nowshad : to  add Follow up
  api.post("/addFollowUp", _doctorsWorkBench.addFollowUp, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by:irfan,to get Patient physical examination
  api.get("/getPatientPhysicalExamination", _doctorsWorkBench.getPatientPhysicalExamination, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to update or delete Patient physical examination
  api.put("/updatePatientPhysicalExam", _doctorsWorkBench.updatePatientPhysicalExam, function (req, res, next) {
    var resultSelect = req.records;
    if (resultSelect.length != 0) {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: resultSelect
      });
      next();
    } else {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No records found"));
    }
  }, _utils.releaseConnection);
  //created by irfan: to  get Patient Allergies
  api.get("/getPatientAllergies", _doctorsWorkBench.getPatientAllergies, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to  getPatientDiagnosis
  api.get("/getPatientDiagnosis", _doctorsWorkBench.getPatientDiagnosis, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to  getPatientDiet
  api.get("/getPatientDiet", _doctorsWorkBench.getPatientDiet, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to  getVitalsHeaderMaster
  api.get("/getVitalsHeaderMaster", _doctorsWorkBench.getVitalsHeaderMaster, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to  addPatientHistory
  api.post("/addPatientHistory", _doctorsWorkBench.addPatientHistory, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by irfan: to  getPatientHistory
  api.get("/getPatientHistory", _doctorsWorkBench.getPatientHistory, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by Nowshad: to  get Follow up Recall
  api.get("/getFollowUp", _doctorsWorkBench.getFollowUp, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  //created by Nowshad: to
  api.get("/getPatientEpisodeSummary", _doctorsWorkBench.getPatientEpisodeSummary, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=doctorsWorkBench.js.map