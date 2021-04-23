import express from "express";
import SalesQuotation from "./controller/SalesQuotation";
import SalesOrder from "./controller/SalesOrder";
import DispatchNote from "./controller/DispatchNote";
import SalesInvoice from "./controller/SalesInvoice";
import SalesSettings from "./controller/SalesSettings";
import SalesReturnEntry from "./controller/SalesReturnEntry";
import ContractManagement from "./controller/ContractManagement";
import SalesDashboard from "./controller/SalesDashboard";

const router = express();
export default function Routing() {
  router.use("/SalesQuotation", SalesQuotation());
  router.use("/SalesOrder", SalesOrder());
  router.use("/DispatchNote", DispatchNote());
  router.use("/SalesInvoice", SalesInvoice());
  router.use("/SalesSettings", SalesSettings());
  router.use("/SalesReturnEntry", SalesReturnEntry());
  router.use("/ContractManagement", ContractManagement());
  router.use("/SalesDashboard", SalesDashboard());
  return router;
}
