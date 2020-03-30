import mongoose, { Schema, mongo } from "mongoose";

const notSchema = new Schema({
  user_id: Number,
  module: String,
  message: String
});

export const notifiModel = mongoose.model("notification", notSchema);
