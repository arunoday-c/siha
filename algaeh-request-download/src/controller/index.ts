import { Router, Request, Response, NextFunction } from "express";
import { initialPush } from "../logicalLayer/initialPush";
interface newRequest extends Request {
  records?: any;
}
export default () => {
  const api = Router();
  api.get(
    "/getDownloadRequest",
    initialPush,
    (req: newRequest, res: Response) => {
      res
        .status(200)
        .json({
          success: true,
          message:
            "We are preparing your request you can download your report after sometime.",
        })
        .end();
    }
  );
  return api;
};
