import { Router } from "express";
import utlities from "algaeh-utilities";
import labModels, {
  bulkSampleCollection,
  updateLabOrderServices,
  updateLabOrderServiceStatus,
  createPCRBatch,
  checkIDExists,
  getBatchDetail,
  updateBatchDetail,
  bulkSampleAcknowledge,
  updateLabSampleStatus,
  patientPortalData,
} from "../models/laboratory";
import { labResultDispatch } from "../models/labDispatch";
import { patientBillGeneration } from "../models/portalToHims";
const {
  getLabOrderedServices,
  getLabOrderServiceForDoc,
  getLabOrderedServicesPatient,
  getTestAnalytes,
  getMicroDetails,
  updateLabResultEntry,
  updateMicroResultEntry,
  getMicroResult,
  getPatientTestList,
  getComparedLabResult,
  updateResultFromMachine,
  getLabOrderedComment,
  getAnalytesByTestID,
  getInvestigationResult,
  generateBarCode,
  updateLabOrderServiceForDoc,
  reloadAnalytesMaster,
  getOrderByTestCategory,
  getSendInAndSendOutTestDetails,
  top10LabOrders,
  labDashBoardWithAttachment,
  updateHassanNo,

  getHESNServices,
} = labModels;
import { processLabSMS, getValidatedResults } from "../models/labSMS";
export default () => {
  const api = Router();
  api.get("/getLabOrderedServices", getLabOrderedServices, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getLabOrderServiceForDoc",
    getLabOrderServiceForDoc,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/getOrderByTestCategory",
    getOrderByTestCategory,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get("/patientPortalData", patientPortalData, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get("/getHESNServices", getHESNServices, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getSendInAndSendOutTestDetails",
    getSendInAndSendOutTestDetails,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get("/top10LabOrders", top10LabOrders, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/bulkSampleCollection", bulkSampleCollection, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.put("/bulkSampleAcknowledge", bulkSampleAcknowledge, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.put(
    "/updateLabOrderServiceForDoc",
    updateLabOrderServiceForDoc,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.put("/updateHassanNo", updateHassanNo, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get(
    "/getLabOrderedServicesPatient",
    getLabOrderedServicesPatient,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

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
  api.put("/generateBarCode", generateBarCode, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

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
  api.get("/getMicroDetails", getMicroDetails, (req, res, next) => {
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

  api.get("/getAnalytesByTestID", getAnalytesByTestID, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.get(
    "/getInvestigationResult",
    getInvestigationResult,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

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
  api.put(
    "/updateLabOrderServiceStatus",
    updateLabOrderServiceStatus,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put("/reloadAnalytesMaster", reloadAnalytesMaster, (req, res, next) => {
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
  api.get("/labResultDispatch", labResultDispatch, (req, res) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get(
    "/labDashBoardWithAttachment",
    labDashBoardWithAttachment,
    (req, res) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: "Message Sent Successfully",
      });
    }
  );
  api.get("/getValidatedResults", getValidatedResults, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req["result"],
      })
      .end();
  });
  api.get("/checkIDExists", checkIDExists, (req, res) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        message: req.records.message,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });
  api.get("/getBatchDetail", getBatchDetail, (req, res) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post("/processLabSMS", processLabSMS, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        message: "Messages are in progress state",
      })
      .end();
  });
  api.post("/createPCRBatch", createPCRBatch, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
  });
  api.put("/updateBatchDetail", updateBatchDetail, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
  });
  api.post("/patientBillGeneration", patientBillGeneration, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records:
          "Bulk Patient verification is under process we intimate you after its complete",
      })
      .end();
  });
  return api;
};
