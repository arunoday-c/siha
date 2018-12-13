import mongoose from "mongoose";
let Schema = mongoose.Schema;
let patientSchema = new Schema({
  pageName: String,
  clientID: String,
  image: Buffer,
  destinationName: String,
  fileExtention: String
});

module.exports = mongoose.model("algaeh_hims_patients", patientSchema);
