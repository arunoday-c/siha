import { Router } from "express";
import utlities from "algaeh-utilities";
import { getDispatchForInvoice } from "../models/SalesInvoice";

export default function SalesOrder() {
    const api = Router();
    // api.post(`/addSalesOrder`,
    //     addSalesOrder,
    //     (req, res, next) => {
    //         res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
    //             success: true,
    //             records: req.records
    //         });
    //     });
    api.get(
        "/getDispatchForInvoice",
        getDispatchForInvoice,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );
    return api;
}
