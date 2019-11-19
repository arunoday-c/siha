import { Router } from "express";
import utlities from "algaeh-utilities";
import stockModels from "../models/stockAdjustment";
import comModels from "../models/commonFunction";
const {
    generateNumber,
    getStockAdjustment,
    addStockAdjustment,
} = stockModels;
const { updateIntoItemLocation } = comModels;
export default () => {
    const api = Router();
    api.get(
        "/getStockAdjustment",
        getStockAdjustment,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    api.post(
        "/addStockAdjustment",
        generateNumber,
        addStockAdjustment,
        updateIntoItemLocation,
        (req, res, next) => {
            res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
                success: true,
                records: req.records
            });
        }
    );

    return api;
};
