import { Router } from "express";
import { getTranslation } from "../Controller/translation";
const api = Router();

api.get("/:lang", getTranslation);

export default api;
