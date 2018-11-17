import mongoose from "mongoose";
import config from "../../keys/keys";
export default callBack => {
  const _db = mongoose.connect(
    config.mongoDb.connectionURI,
    { user: config.mongoDb.user, pwd: config.mongoDb.password }
  );
  callBack(_db);
};
