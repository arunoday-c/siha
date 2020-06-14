import mongoose, { Schema } from "mongoose";

let translationSchema = new Schema({
  fieldName: String,
  en: String,
  ar: String,
});

const translationModel = mongoose.model(
  "algaeh_translations",
  translationSchema
);
export default translationModel;
