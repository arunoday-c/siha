import { Router } from "express";
import utlities from "algaeh-utilities";
import requestQuotation from "../models/RequestForQuotation";
import algaehUtilities from "algaeh-utilities/utilities";

const {
    getRequestForQuotation,
    addRequestForQuotation,
} = requestQuotation;

export default () => {
    const api = Router();
    const utilities = new algaehUtilities();

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

    return api;
};
