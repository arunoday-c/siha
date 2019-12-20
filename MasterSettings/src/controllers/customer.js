import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import customerModels from "../models/customer";

const {
    addCustomerMaster,
    getCustomerMaster,
    updateCustomerMaster
} = customerModels;

export default () => {
    let api = Router();
    const utlities = new algaehUtlities();

    api.post("/addCustomerMaster", addCustomerMaster, (req, res, next) => {
        let result = req.records;
        res.status(utlities.httpStatus().ok).json({
            success: true,
            records: result
        });
        next();
    });

    api.put("/updateCustomerMaster", updateCustomerMaster, (req, res, next) => {
        let result = req.records;
        res.status(utlities.httpStatus().ok).json({
            success: true,
            records: result
        });
        next();
    });

    api.get("/getCustomerMaster", getCustomerMaster, (req, res, next) => {
        let result = req.records;
        res.status(utlities.httpStatus().ok).json({
            success: true,
            records: result
        });
        next();
    });

    return api;
};
