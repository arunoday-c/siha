import { Router } from "express";

export default () => {
  const api = Router();
  api.get("/save");
  return api;
};
