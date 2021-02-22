import "module-alias/register";
import "./connection";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
// @ts-ignore
import { authentication } from "algaeh-utilities/authentication";
import router from "./router/";

const app = express();
const port = process.env.PORT ?? 3023;
app.use(cors());
app.use(
  bodyParser.json({
    // extended: true,
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url.indexOf("/microBuild") > -1) {
    next();
    return;
  }

  authentication(req, res, next);
});
app.use("/api/v1", router);
app.use("/microBuild/", express.static(path.resolve("../", "client/build")));
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  error.status = error.status || 500;
  const errorMessage =
    error.sqlMessage != null ? error.sqlMessage : error.message;
  res
    .status(error.status)
    .json({
      success: false,
      isSql: error.sqlMessage != null ? true : false,
      message: errorMessage,
    })
    .end();
});
app.listen(port, () => {
  console.log(`Daycare Server started at  http://localhost:${port}`);
});
