"use strict";

var _lokijs = require("lokijs");

var _lokijs2 = _interopRequireDefault(_lokijs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filePath = _path2.default.join(__dirname, "../../Masters/generalMasterCache.json");
var db = new _lokijs2.default(filePath);

//Get From cache(.Json)
var getCacheData = function getCacheData(options, callBack) {
  try {
    var masterCollection = null;
    if (_fs2.default.existsSync(filePath)) {
      db.loadJSON(_fs2.default.readFileSync(filePath));
      masterCollection = db.getCollection(options.key);
    }
    masterCollection = db.getCollection(options.key);

    var data = masterCollection != null ? masterCollection.data : null;
    if (data != null && data.length == 0) {
      data = null;
    }
    if (typeof callBack == "function") callBack(data);
  } catch (e) {
    console.error("Error in Cache data : ", e);
  }
};

//Add From cache(.Json)
var setCacheData = function setCacheData(options, callBack) {
  try {
    var masterCollection = db.addCollection(options.key, {
      disableMeta: true
    });
    masterCollection.insert(options.value);
    db.save();
    if (typeof callBack == "function") callBack(options.value);
  } catch (e) {
    console.error("Error in Cache data : ", e);
  }
};

//Delete From cache(.Json)
var deleteFromCache = function deleteFromCache(tableName) {
  var masterCollection = null;
  if (_fs2.default.existsSync(filePath)) {
    db.loadJSON(_fs2.default.readFileSync(filePath));
    masterCollection = db.getCollection(tableName);
  }

  if (masterCollection != null) {
    (0, _logging.debugLog)("before Remove", masterCollection);
    masterCollection.clear();
    db.save();
    (0, _logging.debugLog)("after Remove");
  }
};

module.exports = {
  getCacheData: getCacheData,
  setCacheData: setCacheData,
  deleteFromCache: deleteFromCache
};
//# sourceMappingURL=caching.js.map