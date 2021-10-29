import { Router } from "express";
import { requestDownload } from "../model/requestDownload";
export default () => {
  const api = Router();
  api.get("/downloadReport", requestDownload);
  return api;
};
