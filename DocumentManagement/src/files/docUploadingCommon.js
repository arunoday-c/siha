import path from "path";
// import stream from "stream";
import fs from "fs-extra";
// import mime from "mime-types";
import uploadDocumentSchema from "../Model/docUploadingCommon";
// import imageThumbnail from "image-thumbnail";
// import PatientDocModel from "./patientDoc";
// import CompanyDocModel from "./company";
// import formidable from "formidable";
import "regenerator-runtime/runtime";
const folder = process.env.UPLOADFOLDER || process.cwd();
export async function uploadDocumentCommon(req, res, next) {
  try {
    // const fieldObject = req.headers["x-file-details"]
    //   ? JSON.parse(req.headers["x-file-details"])
    //   : {};
    const uploadExists = folder.toUpperCase().includes("UPLOAD");
    const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
    if (!fs.pathExistsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    let fieldObject = {};
    let dataToSave = {};
    req.pipe(req.busboy);
    dataToSave = {
      // pageName: fieldObject["pageName"],
      // clientID: req.headers["x-client-ip"],
      // // destinationName: fieldObject["destinationName"],
      // sub_dept_name: fieldObject.sub_dept_name,
      // sub_department_id: fieldObject.sub_department_id,
      // fromPath: true,
      // fileExtention: mimetype,
      // filename: fieldObject["fileName"],
      updatedDate: new Date(),
    };
    req.busboy.on("field", function (key, value) {
      fieldObject[key] = value;

      dataToSave = { ...dataToSave, [key]: value };
      // console.log("Inside Fields,", [key], " : ", value);
    });

    req.busboy.on(
      "file",
      async (fieldName, file, filename, encoding, mimetype) => {
        dataToSave["fromPath"] = true;
        dataToSave["filename"] = filename;
        dataToSave["fileExtention"] = mimetype;
        uploadDocumentSchema.insertMany([dataToSave], (err, docs) => {
          if (err) {
            next(err);
            return;
          }
          if (docs.length === 0) {
            next(new Error("Error in inserting to document server."));
            return;
          }
          const unique = docs[0]._id.toString();

          const uploadDocFolder = path.join(
            uploadPath,
            fieldObject.nameOfTheFolder
          );
          if (!fs.pathExistsSync(uploadDocFolder)) {
            fs.mkdirSync(uploadDocFolder);
          }
          const uploadSpecificFolder = path.join(
            uploadDocFolder,
            fieldObject.doc_number
          );
          if (!fs.pathExistsSync(uploadSpecificFolder)) {
            fs.mkdirSync(uploadSpecificFolder);
          }
          const fileNameWithUnique = `${unique}__ALGAEH__${filename}`;
          const fullImagePath = path.join(
            uploadSpecificFolder,
            fileNameWithUnique
          );
          const fStream = fs.createWriteStream(fullImagePath);
          file.pipe(fStream);
          fStream.on("close", () => {
            res.status(200).json({
              success: true,
              records: fileNameWithUnique,
              message: "Updated Successfully",
            });
          });
        });
      }
    );
  } catch (error) {
    next(error);
  }
}

export function getUploadedCommonFile(req, res, next) {
  try {
    const input = req.query;

    let commonItemDoc;
    // // let filter = {};
    debugger;
    commonItemDoc = uploadDocumentSchema;
    const { doc_number } = input;
    // const uploadExists = folder.toUpperCase().includes("UPLOAD");
    // const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");

    // const uploadedDocFolder = path.join(uploadPath, docUploadedFolder);

    // const docFolder = path.join(uploadedDocFolder, doc_number);
    // filter = { sub_department_id, filename };
    // const subId = parseInt(sub_department_id);

    // fs.readdir(docFolder, function (err, files) {
    //   //handling error
    //   if (err) {
    //     res.status(400).json({ error: err.message });
    //   } else {
    //     res.status(200).json({ success: true, data: files });
    //   }
    // });
    commonItemDoc.find({ doc_number }, (err, docs) => {
      debugger;
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(200).json({ success: true, data: docs });
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}
export const deleteCommonFile = (req, res) => {
  const { id, docUploadedFolder, doc_number } = req.body;
  uploadDocumentSchema.findByIdAndDelete(id.trim(), (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      const uploadExists = folder.toUpperCase().includes("UPLOAD");
      const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
      const uploadedDocFolder = path.join(uploadPath, docUploadedFolder);
      const docFolder = path.join(uploadedDocFolder, doc_number);
      fs.unlinkSync(path.resolve(docFolder, `${id}__ALGAEH__${docs.filename}`));
      res.status(200).json({ success: true, data: docs });
    }
  });
};
