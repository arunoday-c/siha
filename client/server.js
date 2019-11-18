const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.listen(1313, console.log("Client started on port 1313"));
