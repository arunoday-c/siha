import Router from "koa-router";
// import { tested, tested2 } from "../models/test"
import { addSalesQuotation } from "../models/SalesQuotation";

export default function SalesQuotation() {
  const router = new Router();
  router.post(`/addSalesQuotation`, addSalesQuotation);
  // router.post(`/addSalesQuotation`, tested, tested2);//ctx.userIdentity
  return router;
}
