import mongoose from "mongoose";
let Schema = mongoose.Schema;
let employeeSchema = new Schema({
  pageName: String,
  clientID: String,
  image: Buffer,
  destinationName: Object,
  fileExtention: String,
  updatedDate: Date
});

module.exports = mongoose.model("algaeh_hims_employees", employeeSchema);
