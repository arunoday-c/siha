import express from "express";
import SalesQuotation from "./controller/SalesQuotation";
export default function Routing(BASE_URL) {
  const router = express();
  router.use("/quotations", SalesQuotation());
  return router;
}
