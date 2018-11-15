import mongoose from "mongoose";
import config from "../../keys/keys";
export default callBack => {
  const _db = mongoose.connect(config.mongoDb);
  callBack(_db);
};
