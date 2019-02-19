import { Router } from "express";
import { generateExcel } from "../models/excel_file";
export default () => {
  const api = Router();
  api.post("/create", generateExcel);
  return api;
};
