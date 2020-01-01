import { Router } from "express";
import utlities from "algaeh-utilities";
import {
    addSalesOrder,
    getSalesOrder,
    getSalesQuotationForOrder,
    getSalesOrderList,
    updateSalesOrderEntry
} from "../models/SalesOrder";

export default function SalesOrder() {
    const api = Router();
    api.post(`/addSalesOrder`, addSalesOrder, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.get("/getSalesOrder", getSalesOrder, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.get("/getSalesQuotationForOrder", getSalesQuotationForOrder, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.get("/getSalesOrderList", getSalesOrderList, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.put("/updateSalesOrderEntry", updateSalesOrderEntry, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });
    return api;
}
