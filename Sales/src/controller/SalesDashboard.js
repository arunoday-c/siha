import { Router } from "express";
import utlities from "algaeh-utilities";
import salesModels from "../models/SalesDashboard";
const {
  top10SalesIncomebyItem,
  top10SalesIncomebyServices,
  top10SalesIncomebyCostCenter,
  salesDashBoardWithAttachment,
} = salesModels;

export default () => {
  const api = Router();
  api.get(
    "/top10SalesIncomebyItem",
    top10SalesIncomebyItem,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/top10SalesIncomebyServices",
    top10SalesIncomebyServices,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/top10SalesIncomebyCostCenter",
    top10SalesIncomebyCostCenter,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );
  api.get(
    "/salesDashBoardWithAttachment",
    salesDashBoardWithAttachment,
    (req, res) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: "Message Sent Successfully",
      });
    }
  );

  return api;
};
