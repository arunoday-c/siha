import { Router } from "express";
import utlities from "algaeh-utilities";
import {
    getDispatchForInvoice,
    getDispatchItemDetails,
    getSalesOrderServiceInvoice,
    addInvoiceEntry,
    getInvoiceEntry,
    postSalesInvoice,
    generateAccountingEntry,
    revertSalesInvoice,
    CancelSalesInvoice
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


    api.put(
        "/postSalesInvoice",
        postSalesInvoice,
        generateAccountingEntry,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });
    api.put(
        "/generateAccountingEntry",
        generateAccountingEntry,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });
    api.put(
        "/revertSalesInvoice",
        revertSalesInvoice,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });
    api.put(
        "/CancelSalesInvoice",
        CancelSalesInvoice,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });
    return api;
}
