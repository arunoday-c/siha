import idb from "idb";
import momemt from "moment";

export function checkToken(callBack) {
  const dbPromise = idb.open("Hims", 1, upgradeDB => {
    upgradeDB.createObjectStore("configCollection", { keyPath: "id" });
    upgradeDB.createObjectStore("keyResource", { keyPath: "id" });
  });
  dbPromise
    .then(db => {
      return db
        .transaction("configCollection")
        .objectStore("configCollection")
        .getAll();
    })
    .then(result => {
      const reg_date = parseInt(
        result !== undefined && result.length > 0
          ? momemt(result[0]["auth"]["expiryDate"]).format("YYYYMMDD")
          : momemt().format("YYYYMMDD")
      );
      const current_date = parseInt(
        result !== undefined && result.length > 0
          ? momemt().format("YYYYMMDD")
          : momemt()
              .add(1, "days")
              .format("YYYYMMDD")
      );
      if (current_date >= reg_date) {
        return dbPromise.then(db => {
          const tx = db.transaction("configCollection", "readwrite");
          tx.objectStore("configCollection").delete(1);
          callBack(db);
        });
      }
    });
}

export function getIndexedToken(callBack) {
  const dbPromise = idb.open("Hims", 1, upgradeDB => {
    upgradeDB.createObjectStore("configCollection", { keyPath: "id" });
    upgradeDB.createObjectStore("keyResource", { keyPath: "id" });
  });
  let returnObject = {};
  dbPromise
    .then(db => {
      return db
        .transaction("configCollection")
        .objectStore("configCollection")
        .getAll();
    })
    .then(result => {
      returnObject["auth"] = result[0]["auth"];
    });
  dbPromise
    .then(db => {
      return db
        .transaction("keyResource")
        .objectStore("keyResource")
        .getAll();
    })
    .then(rec => {
      returnObject["keyResource"] = rec[0]["auth"];
      callBack(returnObject);
    })
    .catch(e => {
      returnObject["keyResource"] = null;
      callBack(returnObject);
    });
}
export function setSecure(data) {
  const dbPromise = idb.open("Hims", 1, upgradeDB => {
    upgradeDB.createObjectStore("secureModel", { keyPath: "id" });
  });
  dbPromise.then(db => {
    db.transaction("secureModel", "readwrite")
      .objectStore("secureModel")
      .delete(1);
  });
  dbPromise.then(db => {
    return db
      .transaction("secureModel", "readwrite")
      .objectStore("secureModel")
      .put({
        id: 1,
        secData: data
      }).complete;
  });
}

export function setLocaion(data) {
  const dbPromise = idb.open("Hims", 1, upgradeDB => {
    upgradeDB.createObjectStore("LabLocation", { keyPath: "id" });
  });
  dbPromise.then(db => {
    db.transaction("LabLocation", "readwrite")
      .objectStore("LabLocation")
      .delete(1);
  });
  dbPromise.then(db => {
    db
      .transaction("LabLocation", "readwrite")
      .objectStore("LabLocation")
      .put({
        id: 1,
        secData: data
      }).complete;
  });
}
