import { Router } from "express";
import utlities from "algaeh-utilities";
import poSettingsModels from "../models/POSettings";
// import algaehUtilities from "algaeh-utilities/utilities";

const {
    getPOOptions,
    addPOOptions,
    updatePOOptions,
} = poSettingsModels;

export default () => {
    const api = Router();
    // const utilities = new algaehUtilities();

    api.get("/getPOOptions", getPOOptions, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });


    api.post(
        "/addPOOptions", addPOOptions, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    api.put(
        "/updatePOOptions", updatePOOptions, (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    return api;
};
