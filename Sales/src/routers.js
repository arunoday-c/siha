import express from "express";
import SalesQuotation from "./controller/SalesQuotation";
import SalesOrder from "./controller/SalesOrder";

const router = express();
export default function Routing() {
  router.use("/SalesQuotation", SalesQuotation());
  router.use("/SalesOrder", SalesOrder());
  return router;
}
