import loki from "lokijs";
import extend from "extend";
import path from "path";
import fs from "fs";

let db = new loki("algaeh_users.json", { autoload: true });
let saveUserPreferences = (req, res, next) => {
  let settings = extend(
    {
      dbName: "algaeh_users"
    },
    req.body
  );

  settings.userId = req.userIdentity.algaeh_d_app_user_id;
  //let db = new loki("algaeh_users.json", { autoload: true });

  let collection = db.getCollection("User_" + settings.userId);

  if (collection != null) {
    let usedRow = collection.find({
      screenName: settings.screenName,
      identifier: settings.identifier
    });
    if (usedRow) collection.remove(usedRow);
  }

  let userCollection = db.addCollection("User_" + settings.userId, {
    disableMeta: true
  });

  userCollection.insert({
    screenName: settings.screenName,
    identifier: settings.identifier,
    selectedValue: settings.value,
    name: settings.name
  });
  db.save();
  res.status(200).json({
    success: false,
    records: "done"
  });
};
let getUserPreferences = (req, res, next) => {
  let settings = extend(
    {
      dbName: "algaeh_users"
    },
    req.query
  );

  settings.userId = req.userIdentity.algaeh_d_app_user_id;

  let filePath = path.join(__dirname, "../../algaeh_users.json");

  if (!fs.existsSync(filePath)) {
    res.status(200).json({
      success: true,
      records: {}
    });
    return;
  }

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

export default {
  getUserPreferences,
  saveUserPreferences
};
