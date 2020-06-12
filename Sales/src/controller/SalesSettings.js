import { Router } from "express";
import utlities from "algaeh-utilities";
import salesSettingsModels from "../models/SalesSettings";
// import algaehUtilities from "algaeh-utilities/utilities";

const {
    getSalesOptions,
    addSalesOptions,
    updateSalesOptions,
} = salesSettingsModels;

export default () => {
    const api = Router();
    // const utilities = new algaehUtilities();

    api.get("/getSalesOptions", getSalesOptions, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });


    api.post(
        "/addSalesOptions", addSalesOptions, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    api.put(
        "/updateSalesOptions", updateSalesOptions, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    return api;
};
