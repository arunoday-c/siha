import mongoose from "mongoose";
let Schema = mongoose.Schema;
let employeeSchema = new Schema({
  pageName: String,
  clientID: String,
  image: Buffer,
  destinationName: String,
  fileExtention: String
});

module.exports = mongoose.model("algaeh_hims_employees", employeeSchema);
