import { Response, Request, NextFunction } from "express";
export function catchErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res
    .status(error.status || 400)
    .json({
      success: false,
      message: error.sqlMessage ?? error.message,
      isSql: error.sqlMessage ? true : false,
    })
    .end();
}

export function response(data: any, res: Response) {
  res.status(200).json(data).end();
}
