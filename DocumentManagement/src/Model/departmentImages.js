import mongoose from "mongoose";
let Schema = mongoose.Schema;
let departmentImageSchema = new Schema(
  {
    pageName: String,
    clientID: String,
    image: String,
    destinationName: Object,
    fileExtention: String,
    updatedDate: Date,
  },
  { autoCreate: true }
);

const DeptImages = mongoose.model(
  "algaeh_department_images",
  departmentImageSchema
);
export default DeptImages;
