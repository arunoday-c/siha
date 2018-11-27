import express from "express";
import request from "request";
const router = express();
router.use("/document", (req, res, next) => {
  request.get("http://localhost:3010/api/v1/SaveDocument", (err, res, body) => {
    if (err) {
      next(err);
    }
    res.status(200).json({
      message: "Success",
      status: true
    });
  });
});
export default router;
