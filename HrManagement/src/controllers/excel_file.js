import { Router } from "express";
import excel_file from "../models/excel_file";

const { generateExcel } = excel_file;

export default () => {
  const api = Router();
  api.post("/create", generateExcel);
  return api;
};
