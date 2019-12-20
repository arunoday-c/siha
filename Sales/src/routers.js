import Router from "koa-router";
import SalesQuotation from "./controller/SalesQuotation";
export default function Routing(BASE_URL) {
  const router = new Router();
  router.use(`${BASE_URL}`, SalesQuotation().routes());
  return router;
}
