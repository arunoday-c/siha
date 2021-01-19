import { Request, Response, NextFunction } from "express";
import { insert, select, update, remove } from "easy-db-node";
import { response } from "../general";
export async function insertToScheduler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const inserted = await insert("scheduler", req.body);
    response({ insertedID: inserted }, res);
  } catch (e) {
    next(e);
  }
}
export async function updateToScheduler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, data } = req.body;
    const existing = await select("scheduler", id);
    await update("scheduler", id, { ...existing, ...data });
    response({ message: "Done" }, res);
  } catch (e) {
    next(e);
  }
}
export async function removeToScheduler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.body;
    await remove("scheduler", id);
    response({ message: "Removed Successfully" }, res);
  } catch (e) {
    next(e);
  }
}
export async function getToScheduler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const existing = await select("scheduler");
    response(existing, res);
  } catch (e) {
    next(e);
  }
}
