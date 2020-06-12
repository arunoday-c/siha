import { Router } from "express";
import utlities from "algaeh-utilities";
import salaryModels from "../models/salarypayment";

const {
    getSalaryProcessToPay,
    SaveSalaryPayment,
    getWpsEmployees,
    getEmployeeMiscellaneous,
    deleteMiscEarningsDeductions,
    generateAccountingEntrySalaryPayment
} = salaryModels;

export default () => {
    const api = Router();


    api.get("/getSalaryProcessToPay", getSalaryProcessToPay, (req, res, next) => {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
            success: true,
            result: req.records
        });
    });


    api.put("/SaveSalaryPayment",
        SaveSalaryPayment,
        generateAccountingEntrySalaryPayment,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                result: req.records
            });
        });

    api.get("/getWpsEmployees", getWpsEmployees, (req, res, next) => {
        if (req.records.invalid_input == true) {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: false,
                records: req.records
            });
        } else {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    });

    api.get(
        "/getEmployeeMiscellaneous",
        getEmployeeMiscellaneous,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    api.delete(
        "/deleteMiscEarningsDeductions",
        deleteMiscEarningsDeductions,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    return api;
};
