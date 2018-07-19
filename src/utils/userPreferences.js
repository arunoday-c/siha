import loki from "lokijs";
import extend from "extend";
import path from "path";
import fs from "fs";
import httpStatus from "../utils/httpStatus";
let saveUserPreferences = (req, res, next) => {
  let header = req.headers["x-app-user-identity"];

  if (header == null) {
    next(httpStatus.generateError(httpStatus.badRequest, "unknown user.."));
  }
  header = JSON.parse(header);
  let settings = extend(
    {
      dbName: "algaeh_users"
    },
    req.body
  );

  settings.userId = header.user_id;
  let db = new loki("algaeh_users.json", { autoload: true });
  let userCollection = db.addCollection("User_" + settings.userId, {
    disableMeta: true
  });
  userCollection.insert({
    screenName: settings.screenName,
    identifier: settings.identifier,
    selectedValue: settings.value
  });
  db.save();
  res.status(200).json({
    success: false,
    records: "done"
  });
};
let getUserPreferences = (req, res, next) => {
  let header = req.headers["x-app-user-identity"];

  if (header == null) {
    next(httpStatus.generateError(httpStatus.badRequest, "unknown user.."));
  }
  header = JSON.parse(header);

  let settings = extend(
    {
      dbName: "algaeh_users"
    },
    req.query
  );

  settings.userId = header.user_id;

  let filePath = path.join(__dirname, "../../algaeh_users.json");

  if (!fs.existsSync(filePath)) {
    res.status(200).json({
      success: true,
      records: {}
    });
    return;
  }
  let db = new loki("algaeh_users.json");
  db.loadJSON(fs.readFileSync(filePath));

  let userCollection = db.getCollection("User_" + settings.userId);
  if (userCollection == null) {
    res.status(200).json({
      success: true,
      records: {}
    });
  }
  let row;
  if (settings.identifier != null) {
    row = userCollection.where(obj => {
      return (
        obj.screenName == settings.screenName &&
        obj.identifier == settings.identifier
      );
    });
    if (row != null && row.length != 0) row = row[0];
  } else {
    res.status(400).json({
      success: false,
      message: "Please provide identifier"
    });
  }

  res.status(200).json({
    success: true,
    records: row
  });
};

module.exports = {
  getUserPreferences,
  saveUserPreferences
};
