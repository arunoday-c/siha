import { Router } from "express";
import utlities from "algaeh-utilities";
import {
    addSalesOrder,
    getSalesOrder,
    getSalesQuotationForOrder,
    getSalesOrderList,
    updateSalesOrderEntry,
    cancelSalesServiceOrder,
    ValidateContract
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

    api.put("/cancelSalesServiceOrder", cancelSalesServiceOrder, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.get("/ValidateContract", ValidateContract, (req, res, next) => {
        if (req.records.invalid_input == true) {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: false,
                result: req.records
            });
        } else {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                result: req.records
            });
        }
    });

    return api;
}
