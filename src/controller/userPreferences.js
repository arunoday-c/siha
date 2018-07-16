import { Router } from "express";
import {
  saveUserPreferences,
  getUserPreferences
} from "../utils/userPreferences";
export default () => {
  let api = Router();
  api.get("/get", getUserPreferences);
  api.post("/save", saveUserPreferences);
  return api;
};
