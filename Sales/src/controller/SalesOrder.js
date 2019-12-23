import { Router } from "express";
import utlities from "algaeh-utilities";
import { addSalesOrder, getSalesOrder } from "../models/SalesOrder";

export default function SalesOrder() {
    const api = Router();
    api.post(`/addSalesOrder`,
        addSalesOrder,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        });
    api.get(
        "/getSalesOrder",
        getSalesOrder,
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
