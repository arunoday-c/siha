import mongoose from "mongoose";
const userPreferenceSchema = new mongoose.Schema({
  userID: String,
  screenID: String,
  screens: Array,
  selectedLanguage: String,
  selectedTheme: String
});
export default mongoose.model("algaeh_user_preference", userPreferenceSchema);
