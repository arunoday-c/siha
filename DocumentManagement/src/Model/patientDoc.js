import mongoose from "mongoose";
let Schema = mongoose.Schema;
let patientSchema = new Schema({
  pageName: String,
  clientID: String,
  image: String,
  destinationName: Object,
  fileExtention: String,
  updatedDate: Date
});

module.exports = mongoose.model("algaeh_hims_patients", patientSchema);
