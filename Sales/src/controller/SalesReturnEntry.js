import { Router } from "express";
import utlities from "algaeh-utilities";
import {
    getSalesReturn,
    getInvoiceEntryItems,
    addSalesReturn,
    postSalesReturnEntry,
    generateAccountingEntry
} from "../models/SalesReturnEntry";
import inventoryModel from "algaeh-inventory/src/models/commonFunction";

const { updateIntoInvItemLocation } = inventoryModel

export default function SalesQuotation() {
    const api = Router();

    api.get(
        "/getInvoiceEntryItems", getInvoiceEntryItems, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    api.get(
        "/getSalesReturn", getSalesReturn, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    api.post(
        "/addSalesReturn", addSalesReturn, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    api.put("/postSalesReturnEntry",
        postSalesReturnEntry,
        generateAccountingEntry,
        updateIntoInvItemLocation,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });

    return api;
}
