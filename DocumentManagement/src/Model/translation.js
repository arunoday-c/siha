import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

let translationSchema = new Schema({
  fieldName: { type: String, index: true },
  en: String,
  ar: String,
});

translationSchema.plugin(mongoosePaginate);

const translationModel = mongoose.model(
  "algaeh_translations",
  translationSchema
);
export default translationModel;
