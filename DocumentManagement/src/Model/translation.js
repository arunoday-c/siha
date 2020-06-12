import mongoose, { Schema } from "mongoose";

let translationSchema = new Schema({
  fieldName: String,
  translations: {
    type: Map,
    of: String,
  },
});

const translationModel = mongoose.model(
  "algaeh_translations",
  translationSchema
);
export default translationModel;
