import { Router } from "express";
import utlities from "algaeh-utilities";
import vendorQuotation from "../models/VendorsQuotation";

const {
    getVendorQuotation,
    addVendorQuotation,
} = vendorQuotation;

export default () => {
    const api = Router();

    api.get("/getVendorQuotation", getVendorQuotation, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.post(
        "/addVendorQuotation", addVendorQuotation, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    return api;
};
