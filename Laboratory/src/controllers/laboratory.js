import { Router } from "express";
import utlities from "algaeh-utilities";
import labModels from "../models/laboratory";

const {
  getLabOrderedServices,
  updateLabOrderServices,
  getTestAnalytes,
  updateLabSampleStatus,
  updateLabResultEntry,
  updateMicroResultEntry,
  getMicroResult,
  getPatientTestList,
  getComparedLabResult,
  updateResultFromMachine,
  getLabOrderedComment,
} = labModels;

export default () => {
  const api = Router();
  api.get("/getLabOrderedServices", getLabOrderedServices, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getLabOrderedComment", getLabOrderedComment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getPatientTestList", getPatientTestList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateLabOrderServices",
    updateLabOrderServices,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getTestAnalytes", getTestAnalytes, (req, res, next) => {
    const data = req.records;
    for (let i = 0; i < data.length; i++) {
      data[i].hims_f_lab_order_id = parseInt(req.query.order_id, 10);
      if (data[i].status === "E" || data[i].status === "N") {
        data[i].validate = "N";
        data[i].confirm = "N";
      } else if (data[i].status === "C") {
        data[i].validate = "N";
        data[i].confirm = "Y";
      } else if (data[i].status === "V") {
        data[i].validate = "Y";
        data[i].confirm = "Y";
      }
    }
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getMicroResult", getMicroResult, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateLabSampleStatus", updateLabSampleStatus, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateLabResultEntry", updateLabResultEntry, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateMicroResultEntry",
    updateMicroResultEntry,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get("/getComparedLabResult", getComparedLabResult, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });

  api.put(
    "/updateResultFromMachine",
    updateResultFromMachine,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  return api;
};
