import express from "express";
import cors from "cors";
const path = require("path");
const app = express();

app.use(cors());
if (process.env.NODE_ENV === "production") {
  console.log(path.resolve("./", "client/build"), "prod");
  app.use(express.static(path.resolve("./", "client/build")));
} else {
  console.log(path.resolve("./", "client/dist"), "dev");
  app.use(express.static(path.resolve("./", "client/dist")));
}

app.get("/api/v1", (req, res) => {
  console.log("accessed");
  res.json({ message: "Hello From Api" });
});
const PORT = process.env.PORT || 3007;

app.listen(PORT, () => console.log("Finance server started"));
