import { Router } from "express";
import userPrefModels from "../utils/userPreferences";

const { saveUserPreferences, getUserPreferences } = userPrefModels;

export default () => {
  let api = Router();
  api.get("/get", getUserPreferences);
  api.post("/save", saveUserPreferences);
  return api;
};
