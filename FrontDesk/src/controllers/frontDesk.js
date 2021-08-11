import { Router } from "express";
import utlities from "algaeh-utilities";
import frontModels, { getDoctorAndDepartment } from "../models/frontDesk";
import regModels from "../models/patientRegistration";
import visitModels, { getPatientDetails } from "../models/visit";
import billModels from "algaeh-billing/src/models/billing";
import labModels from "algaeh-laboratory/src/models/laboratory";
import radModels from "algaeh-radiology/src/models/radiology";
import opModels from "algaeh-billing/src/models/opCreditSettlement";

const {
  insertPatientVisitData,
  addPatientInsuranceData,
  addEpisodeEncounterData,
} = visitModels;
const { insertPatientData } = regModels;
const {
  selectFrontDesk,
  addFrontDesk,
  updateFrontDesk,
  getCashHandoverDetails,
  getCashForDashBoard,
  getFrontDeskDataForEmployee,
  updateCashHandoverDetails,
  getFrontDeskDataForWeek,
  getFrontDeskDashboardForSubdept,
  getFrontDeskDashboardDoctor,
} = frontModels;

const {
  newReceiptData,
  addBillData,
  generateAccountingEntry,
  addCashHandover,
  updatePatientPackage,
} = billModels;
import { confirmAppointmentSMS } from "../models/appointmentSMS";

const { insertLadOrderedServices } = labModels;
const { insertRadOrderedServices } = radModels;

const { getPatientwiseBill } = opModels;

export default () => {
  const api = Router();

  api.get("/get", selectFrontDesk, getPatientwiseBill, (req, res, next) => {
    let _billriedt = req.bill_criedt;
    let _frontdesk = req.records;

    let result = { ..._frontdesk, ..._billriedt };
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result,
    });
  });

  api.post(
    "/add",
    addFrontDesk,
    insertPatientData,
    insertPatientVisitData,
    addPatientInsuranceData,
    newReceiptData,
    addBillData,

    (req, res, next) => {
      if (req.body.from_package == true) {
        updatePatientPackage(req, res, next);
        insertLadOrderedServices(req, res, next);
        insertRadOrderedServices(req, res, next);
      } else {
        next();
      }
    },
    generateAccountingEntry,
    addCashHandover,
    (req, res, next) => {
      if (
        req.records.internal_error != undefined &&
        req.records.internal_error == true
      ) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,

          records: {
            internal_error: req.records.internal_error,
            message: req.records.message,
          },
        });
      } else {
        next();
      }
    },
    addEpisodeEncounterData,

    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/confirmAppointmentSMS",
    confirmAppointmentSMS,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post(
    "/update",
    updateFrontDesk,
    insertPatientVisitData,
    addPatientInsuranceData,
    newReceiptData,
    addBillData,
    (req, res, next) => {
      if (req.body.from_package == true) {
        updatePatientPackage(req, res, next);
      } else {
        console.log("one ");
        next();
      }
    },
    (req, res, next) => {
      if (req.body.from_package == true) {
        insertLadOrderedServices(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      if (req.body.from_package == true) {
        insertRadOrderedServices(req, res, next);
      } else {
        next();
      }
    },
    generateAccountingEntry,
    addCashHandover,
    (req, res, next) => {
      if (
        req.records.internal_error != undefined &&
        req.records.internal_error == true
      ) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: {
            internal_error: req.records.internal_error,
            message: req.records.message,
          },
        });
      } else {
        next();
      }
    },
    getPatientDetails,
    addEpisodeEncounterData,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get(
    "/getCashHandoverDetails",
    getCashHandoverDetails,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get("/getCashForDashBoard", getCashForDashBoard, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });
  api.get(
    "/getFrontDeskDataForEmployee",
    getFrontDeskDataForEmployee,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/getFrontDeskDataForWeek",
    getFrontDeskDataForWeek,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/getFrontDeskDashboardForSubdept",
    getFrontDeskDashboardForSubdept,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/getFrontDeskDashboardDoctor",
    getFrontDeskDashboardDoctor,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.put(
    "/updateCashHandoverDetails",
    updateCashHandoverDetails,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getDoctorAndDepartment", getDoctorAndDepartment, (req, res) => {
    res
      .status(utlities.AlgaehUtilities().httpStatus().ok)
      .json({
        success: true,
        records: req.records,
      })
      .end();
    delete req.records;
  });
  return api;
};
