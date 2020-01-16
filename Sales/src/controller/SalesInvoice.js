import { Router } from "express";
import utlities from "algaeh-utilities";
import {
    getDispatchForInvoice,
    getDispatchItemDetails,
    getSalesOrderServiceInvoice,
    addInvoiceEntry,
    getInvoiceEntry
} from "../models/SalesInvoice";

export default function SalesOrder() {
    const api = Router();
    api.get(`/getDispatchItemDetails`, getDispatchItemDetails,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    api.get(
        "/getDispatchForInvoice", getDispatchForInvoice,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    api.get(
        "/getSalesOrderServiceInvoice", getSalesOrderServiceInvoice,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    api.get(
        "/getInvoiceEntry", getInvoiceEntry,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    api.post(
        "/addInvoiceEntry", addInvoiceEntry,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    return api;
}
