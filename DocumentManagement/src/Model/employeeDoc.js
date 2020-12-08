import mongoose from "mongoose";
let Schema = mongoose.Schema;
let employeeSchema = new Schema(
  {
    pageName: String,
    clientID: String,
    image: String,
    destinationName: Object || String,
    fileExtention: String,
    updatedDate: Date,
    fromPath: Boolean,
    filename: String,
  },
  { autoCreate: true }
);

const empModel = mongoose.model("algaeh_hims_employees", employeeSchema);
export default empModel;
