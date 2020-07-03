import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addContractManagement,
  getContractManagement,
  getContractManagementList,
  getOrderListGenContract,
  updateContractManagement,
} from "../models/ContractManagement";

export default function SalesQuotation() {
  const api = Router();
  api.post(
    `/addContractManagement`,
    addContractManagement,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get(`/getContractManagement`, getContractManagement, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateContractManagement",
    updateContractManagement,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        message: "Successfully done.",
      });
    }
  );

  api.get(
    "/getContractManagementList",
    getContractManagementList,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/getOrderListGenContract",
    getOrderListGenContract,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  return api;
}
