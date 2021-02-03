import "module-alias/register";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
// @ts-ignore
import { authentication } from "algaeh-utilities/authentication";
const app = express();
const port = process.env.PORT ?? 3023;
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url.indexOf("/microBuild") > -1) {
    next();
    return;
  }
  // authentication(req, res, next);
});
app.use("/microBuild/", express.static(path.resolve("../", "client/build")));

app.listen(port, () => {
  console.log(`Daycare Server started at http://localhost:${port}`);
});
