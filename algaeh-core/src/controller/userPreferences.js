import { Router } from "express";
import userPrefModels from "../utils/userPreferences";

const { saveUserPreferences, getUserPreferences } = userPrefModels;

export default () => {
  let api = Router();
  api.get(
    "/get",
    // (req, res, next) => {
    //   console.log("req", req.query);
    //   next();
    // },
    getUserPreferences
  );
  api.post(
    "/save",
    // (req, res, next) => {
    //   console.log("req Save", req.body);
    //   next();
    // },
    saveUserPreferences
  );
  return api;
};
