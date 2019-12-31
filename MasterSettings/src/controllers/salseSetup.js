import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import salesSetupModels from "../models/salseSetup";

const {
    addTermsConditions,
    updateTermsConditions,
    getTermsConditions
} = salesSetupModels;

export default () => {
    let api = Router();
    const utlities = new algaehUtlities();

    api.post("/addTermsConditions", addTermsConditions, (req, res, next) => {
        let result = req.records;
        res.status(utlities.httpStatus().ok).json({
            success: true,
            records: result
        });
        next();
    });

    api.put("/updateTermsConditions", updateTermsConditions, (req, res, next) => {
        let result = req.records;
        res.status(utlities.httpStatus().ok).json({
            success: true,
            records: result
        });
        next();
    });

    api.get("/getTermsConditions", getTermsConditions, (req, res, next) => {
        let result = req.records;
        res.status(utlities.httpStatus().ok).json({
            success: true,
            records: result
        });
        next();
    });

    return api;
};
