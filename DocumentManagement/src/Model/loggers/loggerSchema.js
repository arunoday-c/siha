import mongoose from "mongoose";
const loggerSchema = new mongoose.Schema({
  level: { type: String },
  message: { type: String },
  timestamp: { type: Date },
  meta: { type: Object }
});
export default mongoose.model("audit_logs", loggerSchema);
