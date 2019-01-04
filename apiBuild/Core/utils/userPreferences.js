"use strict";

var _lokijs = require("lokijs");

var _lokijs2 = _interopRequireDefault(_lokijs);

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _lokijs2.default("algaeh_users.json", { autoload: true });
var saveUserPreferences = function saveUserPreferences(req, res, next) {
  var settings = (0, _extend2.default)({
    dbName: "algaeh_users"
  }, req.body);

  settings.userId = req.userIdentity.algaeh_d_app_user_id;
  //let db = new loki("algaeh_users.json", { autoload: true });

  var collection = db.getCollection("User_" + settings.userId);

  if (collection != null) {
    var usedRow = collection.find({
      screenName: settings.screenName,
      identifier: settings.identifier
    });
    if (usedRow) collection.remove(usedRow);
  }

  var userCollection = db.addCollection("User_" + settings.userId, {
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
var getUserPreferences = function getUserPreferences(req, res, next) {
  var settings = (0, _extend2.default)({
    dbName: "algaeh_users"
  }, req.query);

  settings.userId = req.userIdentity.algaeh_d_app_user_id;

  var filePath = _path2.default.join(__dirname, "../../algaeh_users.json");

  if (!_fs2.default.existsSync(filePath)) {
    res.status(200).json({
      success: true,
      records: {}
    });
    return;
  }

  db.loadJSON(_fs2.default.readFileSync(filePath));

  var userCollection = db.getCollection("User_" + settings.userId);
  if (userCollection == null) {
    res.status(200).json({
      success: true,
      records: {}
    });
  }
  var row = void 0;
  if (settings.identifier != null) {
    row = userCollection.where(function (obj) {
      return obj.screenName == settings.screenName && obj.identifier == settings.identifier;
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
  getUserPreferences: getUserPreferences,
  saveUserPreferences: saveUserPreferences
};
//# sourceMappingURL=userPreferences.js.map