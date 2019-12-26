import express from "express";
import SalesQuotation from "./controller/SalesQuotation";
import SalesOrder from "./controller/SalesOrder";
import DispatchNote from "./controller/DispatchNote";

const router = express();
export default function Routing() {
  router.use("/SalesQuotation", SalesQuotation());
  router.use("/SalesOrder", SalesOrder());
  router.use("/DispatchNote", DispatchNote());
  return router;
}
