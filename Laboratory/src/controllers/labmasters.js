import { Router } from "express";
import utlities from "algaeh-utilities";
import labModels from "../models/labmasters";

const {
  selectSection,
  insertSection,
  updateSection,
  deleteSection,
  selectContainer,
  insertContainer,
  updateContainer,
  deleteContainer,
  selectSpecimen,
  insertSpecimen,
  updateSpecimen,
  deleteSpecimen,
  selectAnalytes,
  insertAnalytes,
  updateAnalytes,
  deleteAnalytes,
  selectTestCategory,
  insertTestCategory,
  updateTestCategory,
  deleteTestCategory,
  selectAntibiotic,
  insertAntibiotic,
  updateAntibiotic,
  deleteAntibiotic,
  selectMicroGroup,
  insertMicroGroup,
  updateMicroGroup,
  selectGroupAntiMap,
  insertGroupAntiMap,
  updateGroupAntiMap,
  deleteGroupAntiMap,
  selectMachineAnalytesMap,
  insertMachineAnalytesMap,
  updateMachineAnalytesMap,

  addGroupComments,
  updateGroupComments,
  getGroupComments,
  addAnalyteRages,
  getAnalyteRages,
  updateAnalyteRage,
  deleteAnalyteRage,
} = labModels;

export default () => {
  const api = Router();

  //Section
  api.get("/selectSection", selectSection, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertSection", insertSection, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateSection", updateSection, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.delete("/deleteSection", deleteSection, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  //Container
  api.get("/selectContainer", selectContainer, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertContainer", insertContainer, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateContainer", updateContainer, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.delete("/deleteContainer", deleteContainer, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  //Specimen
  api.get("/selectSpecimen", selectSpecimen, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertSpecimen", insertSpecimen, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateSpecimen", updateSpecimen, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.delete("/deleteSpecimen", deleteSpecimen, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  //Analyte
  api.get("/selectAnalytes", selectAnalytes, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertAnalytes", insertAnalytes, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateAnalytes", updateAnalytes, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.delete("/deleteAnalytes", deleteAnalytes, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  //TestCategory
  api.get("/selectTestCategory", selectTestCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertTestCategory", insertTestCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateTestCategory", updateTestCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.delete("/deleteTestCategory", deleteTestCategory, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  //Antibiotic Master
  api.get("/selectAntibiotic", selectAntibiotic, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertAntibiotic", insertAntibiotic, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateAntibiotic", updateAntibiotic, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.delete("/deleteAntibiotic", deleteAntibiotic, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  //Antibiotic Master
  api.get("/selectMicroGroup", selectMicroGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertMicroGroup", insertMicroGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateMicroGroup", updateMicroGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  //Group Antibiotic Map
  api.get("/selectGroupAntiMap", selectGroupAntiMap, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/insertGroupAntiMap", insertGroupAntiMap, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateGroupAntiMap", updateGroupAntiMap, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.put("/deleteGroupAntiMap", deleteGroupAntiMap, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  //Group Antibiotic Map
  api.get(
    "/selectMachineAnalytesMap",
    selectMachineAnalytesMap,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/insertMachineAnalytesMap",
    insertMachineAnalytesMap,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put(
    "/updateMachineAnalytesMap",
    updateMachineAnalytesMap,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getGroupComments", getGroupComments, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.post("/addGroupComments", addGroupComments, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put("/updateGroupComments", updateGroupComments, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.post("/addAnalyteRages", addAnalyteRages, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().internalServer).json({
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
  api.put("/updateAnalyteRage", updateAnalyteRage, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().internalServer).json({
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
  api.get("/getAnalyteRages", getAnalyteRages, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.delete("/deleteAnalyteRage", deleteAnalyteRage, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().internalServer).json({
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

  return api;
};
