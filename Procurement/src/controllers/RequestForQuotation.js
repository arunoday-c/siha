import { Router } from "express";
import utlities from "algaeh-utilities";
import requestQuotation from "../models/RequestForQuotation";

const {
    getRequestForQuotation,
    addRequestForQuotation,
    getRequestQuotationToComapre
} = requestQuotation;

export default () => {
    const api = Router();

    api.get("/getRequestForQuotation", getRequestForQuotation, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.post(
        "/addRequestForQuotation", addRequestForQuotation, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    api.get("/getRequestQuotationToComapre", getRequestQuotationToComapre, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    return api;
};
