import mongoose from "mongoose";
const userPreferenceSchema = new mongoose.Schema({
  userID: { type: String },
  preferences: { type: Array },
  selectedLanguage: { type: String },
  selectedTheme: { type: String },
  language: { type: String },
  theme: { type: String }
});
export default mongoose.model("algaeh_user_preferences", userPreferenceSchema);
