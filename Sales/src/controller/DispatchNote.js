import { Router } from "express";
import utlities from "algaeh-utilities";
import { getSalesOrderItem } from "../models/DispatchNote";

export default function SalesOrder() {
    const api = Router();

    api.get(
        "/getSalesOrderItem",
        getSalesOrderItem,
        (req, res, next) => {
            console.log("Here");
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );
    return api;
}
