import $ from "jquery";
import extend from "extend";
var indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const readFiles = options => {
  /*
    {
        fileName:null,
        fieldName:null
    }
    */
  try {
    let fileImport = "./languages/" + options.fileName + ".json";
    if (!indexedDB) {
      $.getJSON(fileImport, data => {
        options.callBack(options.fieldName);
        return;
      });
    }
    var open = indexedDB.open("languages_db", 1);
    var db;
    // Create the schema
    open.onupgradeneeded = function() {
      db = open.result;
      var store = db.createObjectStore(options.fileName);
      //  var index = store.createIndex("NameIndex", ["name", "value"]);
    };

    open.onsuccess = function() {
      var db = open.result;
      var tx = db.transaction(options.fileName, "readwrite");
      var store = tx.objectStore(options.fileName);

      debugger;
      var cursor = store.openCursor();
      cursor.onsuccess = function(event) {
        var cursora = event.target.result;
        if (cursora) {
          cursora.continue();
        } else {
          $.getJSON(fileImport, data => {
            debugger;
            // var request = db
            //   .transaction(options.fileName, "readwrite")
            //   .objectStore(options.fileName)
            //   .add(data);
            store.add(data);
            // request.onsuccess = function(event) {
            //   console.log("Kenny has been added to your database.");
            // };

            // request.onerror = function(event) {
            //   console.log(
            //     "Unable to add data\r\nKenny is aready exist in your database! "
            //   );
            //};
          });
        }
      };
      //  db.close();
    };
  } catch (e) {
    console.error(e.messsage);
  }
};

export { readFiles };
