import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import publisher from "../publishers";
import { insertRecord } from "./hims_f_request_download";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.join(process.cwd(), "../", ".env_local"),
  });
}
const { SECRETKey } = process.env;
export async function initialPush(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { report } = req.query;
    if (!report) {
      throw new Error("Parameters are mandatory");
    }
    const headers = req.headers;
    const apiKey = headers["x-api-key"];
    const token = jwt.verify(`${apiKey}`, `${SECRETKey}`);
    if (token) {
      const { specialHeader } = JSON.parse(`${report}`);
      let title = "";
      if (Array.isArray(specialHeader)) {
        for (let i = 0; i < specialHeader.length; i++) {
          const { name, value } = specialHeader[i];
          title += `${name} : ${value} 
        `;
        }
      }
      let port = "";
      const splitHost = req.headers.host?.split(":");
      if (splitHost?.length === 2) {
        port = ":3018";
      } else {
        port = "/reports";
      }

      const download_link = `${req.protocol}://${req.hostname}${port}`;
      const primaryId = await insertRecord({
        user_id: token["algaeh_d_app_user_id"],
        report_title: title,
        download_link,
      }).catch((error) => {
        throw error;
      });
      await publisher(
        "REQUEST_DOWNLOAD",
        { report, primaryId },
        { apiKey }
      ).catch((error) => {
        throw error;
      });

      next();
    } else {
      throw new Error("Unknown user request.");
    }
  } catch (e) {
    next(e);
  }
}
