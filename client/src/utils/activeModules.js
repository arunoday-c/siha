export function SaveActiveModules(options) {
  debugger;
  if (options === undefined) {
    return;
  }
  try {
    const request = window.indexedDB.open("algaeh", 1);

    request.onerror = function(event) {
      throw new Error(event.toString());
    };
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore(options.tableName, {
        keyPath: "id",
        autoIncrement: true
      });
      objectStore.transaction.oncomplete = function(event) {
        var customerObjectStore = db
          .transaction(options.tableName, "readwrite")
          .objectStore(options.tableName);
        options.rows.forEach(function(customer) {
          debugger;
          customerObjectStore.add(customer);
        });
      };
    };
  } catch (e) {
    console.error(e.toString());
  }
}
