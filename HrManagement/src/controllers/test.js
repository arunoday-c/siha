import { Router } from "express";
export default () => {
  const api = Router();
  api.get("/mytest", (req, res, next) => {
    console.log("Here in function");
    res.status(200).json({
      success: true
    });
  });
  return api;
};
