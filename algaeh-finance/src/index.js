import express from "express";
import cors from "cors";
const path = require("path");
const app = express();

app.use(cors());
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/../client/build")));
} else {
  app.get("/", (req, res) => {
    res.redirect("http://localhost:1315");
  });
}

app.get("/api/v1", (req, res) => {
  console.log("accessed");
  res.json({ message: "Hello From Api" });
});

app.listen(3007);
