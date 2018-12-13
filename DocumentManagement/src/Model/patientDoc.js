import mongoose from "mongoose";
let Schema = mongoose.Schema;
let employeeSchema = new Schema({
  pageName: String,
  clientID: String,
  image: String,
  destinationName: String
});

module.exports = mongoose.model("algaeh_hims_patients", employeeSchema);
