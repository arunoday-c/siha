//Connection Done
import { Router } from "express";
import utlities from "algaeh-utilities";
import lisIntegModels from "../models/LisIntegration";

const { getLisMachineData, getTestDetails } = lisIntegModels;

export default () => {
    const api = Router();
    api.get("/getLisMachineData", getLisMachineData, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    api.get("/getTestDetails", getTestDetails, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            records: req.records
        });
    });

    return api;
};
