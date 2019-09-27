import mongoose from "mongoose";
import config from "algaeh-keys";
export default callBack => {
  const _db = mongoose.connect(config.default.mongoDb.connectionURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  callBack(_db);
};
