import loki from "lokijs";
import path from "path";
import fs from "fs";
import { debugLog, debugFunction } from "../utils/logging";
let filePath = path.join(__dirname, "../../Masters/generalMasterCache.json");
let db = new loki(filePath);

//Get From cache(.Json)
let getCacheData = (options, callBack) => {
  try {
    let masterCollection = null;
    if (fs.existsSync(filePath)) {
      db.loadJSON(fs.readFileSync(filePath));
      masterCollection = db.getCollection(options.key);
    }
    masterCollection = db.getCollection(options.key);

    let data = masterCollection != null ? masterCollection.data : null;
    if (data != null && data.length == 0) {
      data = null;
    }
    if (typeof callBack == "function") callBack(data);
  } catch (e) {
    console.error("Error in Cache data : ", e);
  }
};

//Add From cache(.Json)
let setCacheData = (options, callBack) => {
  try {
    // let CacheName =
    //   options.cacheName != null
    //     ? options.cacheName + ".json"
    //     : "masterCacheData.json";
    // let filePath = path.join(__dirname, "../../Masters/" + CacheName);
    // let db = null;
    // if (!fs.existsSync(filePath)) {
    //   db = new loki(filePath, { autoload: true });
    // } else {
    //   db = new loki(CacheName);
    //   db.loadJSON(fs.readFileSync(filePath));
    // }

    let masterCollection = db.addCollection(options.key, {
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
let deleteFromCache = tableName => {
  let masterCollection = null;
  if (fs.existsSync(filePath)) {
    db.loadJSON(fs.readFileSync(filePath));
    masterCollection = db.getCollection(tableName);
  }

  if (masterCollection != null) {
    debugLog("before Remove", masterCollection);
    masterCollection.clear();
    db.save();
    debugLog("after Remove");
  }
};

module.exports = {
  getCacheData,
  setCacheData,
  deleteFromCache
};
