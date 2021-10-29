import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import router from "./router";
import consumer from "./consumers";
const app = express();
const port = process.env.PORT ?? 3038;
app.use(cors());
app.use(express.json());
app.use("/api/v1", router);
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
  consumer("REQUEST_DOWNLOAD");
  console.log(
    `Request Download Server is Server started at  http://localhost:${port}`
  );
});
// console.log("<==== Request Download Server is started...====>");
