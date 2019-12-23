import { Router } from "express";
import { Response } from "algaeh-utilities/response";
import { addSalesQuotation } from "../models/SalesQuotation";
import { tested2, tested } from "../models/test";
export default function SalesQuotation() {
  const api = Router();
  api.post(`/addSalesQuotation`, tested, tested2); //addSalesQuotation);
  return api;
}
