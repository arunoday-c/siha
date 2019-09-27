import mongoose from "mongoose";
let Schema = mongoose.Schema;
let companySchema = new Schema({
  pageName: String,
  clientID: String,
  image: String,
  destinationName: Object,
  fileExtention: String,
  updatedDate: Date
});

const compModel = mongoose.model("algaeh_hims_company", companySchema);
export default compModel;
