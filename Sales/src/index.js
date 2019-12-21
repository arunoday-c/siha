import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Routing from "./routers";
import { authenticationKoa } from "algaeh-utilities/authentication";
import algaehKeys from "algaeh-keys";
const app = new Koa();
const port = process.env.PORT;
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200
  })
);
const keys = algaehKeys.default;
process.env.MYSQL_KEYS = JSON.stringify(keys);
app.use(bodyParser());
app.use(authenticationKoa);
const BASE_URL_VERSION_ONE = "/api/v1";
app.use(Routing(BASE_URL_VERSION_ONE).routes());
app.listen(port, () => {
  console.log(`Sales server is started on port - ${port} *`);
});
