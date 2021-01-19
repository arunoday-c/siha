import "module-alias/register";
import express from "express";
import bodyParser from "body-parser";
import { catchErrors } from "./general";
import router from "./router";
import { schedulerTask } from "./scheduler";
const app = express();
const port = process.env.PORT ?? 3022;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(catchErrors);
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`JOB Server started at http://localhost:${port}`);
  schedulerTask();
});
