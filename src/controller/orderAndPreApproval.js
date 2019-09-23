import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { debugLog } from "../utils/logging";
import {
  insertOrderedServices,
  getPreAprovalList,
  updatePreApproval,
  selectOrderServices,
  updateOrderedServices,
  updateOrderedServicesBilled,
  getOrderServices,
  selectOrderServicesbyDoctor,
  getMedicationAprovalList,
  updateMedicinePreApproval,
  updatePrescriptionDetail,
  getVisitConsumable,
  load_orders_for_bill,
  insertInvOrderedServices,
  addPackage,
  getPatientPackage,
  deleteOrderService,
  insertPhysiotherapyServices
} from "../model/orderAndPreApproval";
import { insertRadOrderedServices } from "../model/radiology";
import { insertLadOrderedServices } from "../model/laboratory";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan: to  insertOrderedServices
  api.post(
    "/insertOrderedServices",
    insertOrderedServices,
    insertPhysiotherapyServices,
    insertLadOrderedServices,
    insertRadOrderedServices,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
    }
  );

  // created by irfan : to fetch pre approval list
  api.get(
    "/getPreAprovalList",
    getPreAprovalList,
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
  //created by irfan :to update preApproal
  api.put(
    "/updatePreApproval",
    updatePreApproval,
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

  //created by Nowshad :to get Ordered Services which to bill
  api.get(
    "/selectOrderServices",
    selectOrderServices,
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

  //created by Nowshad :to get Ordered Services which to bill
  api.get(
    "/selectOrderServicesbyDoctor",
    selectOrderServicesbyDoctor,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  //created by Nowshad :to get Ordered Services to Display
  api.get(
    "/getOrderServices",
    getOrderServices,
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
  //created by Nowshad :to get Ordered Services to Display
  api.get(
    "/getMedicationAprovalList",
    getMedicationAprovalList,
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

  //created by irfan :to update OrderedServices
  api.put(
    "/updateOrderedServices",
    updateOrderedServices,
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

  //created by Nowshad :to update OrderedServices as billed
  api.put(
    "/updateOrderedServicesBilled",
    updateOrderedServicesBilled,
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

  //created by Nowshad :to update OrderedServices as billed
  api.put(
    "/updateMedicinePreApproval",
    updateMedicinePreApproval,
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

  //created by Nowshad :to update OrderedServices as billed
  api.put(
    "/updatePrescriptionDetail",
    updatePrescriptionDetail,
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

  //created by Nowshad :to get Ordered Services which to bill
  api.get(
    "/getVisitConsumable",
    getVisitConsumable,
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

  api.post(
    "/insertInvOrderedServices",
    insertInvOrderedServices,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.get("/load_orders_for_bill", load_orders_for_bill, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
    }
  });
  api.post("/addPackage", addPackage, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
    }
  });
  api.get("/getPatientPackage", getPatientPackage, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: req.records
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
    }
  });
  api.delete("/deleteOrderService", deleteOrderService, (req, res, next) => {
    res.status(httpStatus.ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
