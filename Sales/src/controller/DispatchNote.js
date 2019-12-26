import { Router } from "express";
import utlities from "algaeh-utilities";
import { getDispatchNote, getSalesOrderItem, addDispatchNote, updateinvSalesOrderOnceDispatch } from "../models/DispatchNote";
import inventoryModel from "algaeh-inventory/src/models/commonFunction";

const { updateIntoInvItemLocation } = inventoryModel

export default function SalesOrder() {
    const api = Router();

    api.get(
        "/getDispatchNote",
        getDispatchNote,
        (req, res, next) => {
            console.log("Here");
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );
    api.get(
        "/getSalesOrderItem",
        getSalesOrderItem,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    api.post(
        "/addDispatchNote",
        addDispatchNote,
        updateinvSalesOrderOnceDispatch,
        updateIntoInvItemLocation,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    return api;
}
