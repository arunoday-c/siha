import mongoose, { Schema, mongo } from "mongoose";

const notSchema = new Schema(
  {
    user_id: Number,
    module: String,
    message: String,
    title: String,
    pageToRedirect: String,
    fromUserId: Number,
    fromModule: String
  },
  {
    timestamps: true
  }
);

export const notifiModel = mongoose.model("notification", notSchema);
