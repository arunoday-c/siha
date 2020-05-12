import mongoose, { Schema } from "mongoose";

let emailSchema = new Schema({
  host: String,
  port: Number,
  secure: Boolean,
  user: String,
  pass: String,
  is_enabled: Boolean,
});

const emailModel = mongoose.model("email_config", emailSchema);
export default emailModel;
