import mongoose, { Schema } from "mongoose";

const notSchema = new Schema(
  {
    user_id: Number,
    module: String,
    message: String,
    title: String,
    pageToRedirect: String,
    fromUserId: Number,
    fromModule: String,
    isSeen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const notifiModel = mongoose.model("notification", notSchema);
