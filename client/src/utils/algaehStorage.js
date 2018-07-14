import loki from "lokijs";

/*
    User preferencces need to save local in-memory
*/
export function UserPreferences(options) {
  let settings = {
    ...{
      dbName: "algaeh_users"
    },
    ...options
  };
  let db = new loki(settings.dbName);
  let user = db.getCollection("users");
  if (!user) {
    user = db.addCollection("users");
  }
}
