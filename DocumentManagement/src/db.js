import mongoose from "mongoose";
import config from "algaeh-keys";

console.log(config.default.mongoDb.connectionURI);
export default (callBack) => {
  const _db = mongoose.connect(config.default.mongoDb.connectionURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  callBack(_db);
};
