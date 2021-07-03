import path from "path";
// import stream from "stream";
import fs from "fs-extra";
// import mime from "mime-types";

// import imageThumbnail from "image-thumbnail";
// import PatientDocModel from "./patientDoc";
// import CompanyDocModel from "./company";
// import formidable from "formidable";
import "regenerator-runtime/runtime";
const folder = process.env.UPLOADFOLDER || process.cwd();
export async function uploadPatientDoc(req, res, next) {
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
        // uploadDocumentSchema.insertMany([dataToSave], (err, docs) => {

        //   const unique = docs[0]._id.toString();
        const patientFolderName = path.join(uploadPath, "PatientDocuments");
        if (!fs.pathExistsSync(patientFolderName)) {
          fs.mkdirSync(patientFolderName);
        }
        const patientFolder = path.join(
          patientFolderName,
          fieldObject.PatientFolderName
        );
        if (!fs.pathExistsSync(patientFolder)) {
          fs.mkdirSync(patientFolder);
        }
        const uploadDocFolder = path.join(
          patientFolder,
          fieldObject.nameOfTheFolder
        );
        if (!fs.pathExistsSync(uploadDocFolder)) {
          fs.mkdirSync(uploadDocFolder);
        }
        let uploadSpecificFolder = path.join(
          uploadDocFolder,
          fieldObject.doc_number
        );
        if (!fs.pathExistsSync(uploadSpecificFolder)) {
          fs.mkdirSync(uploadSpecificFolder);
        }

        let fileNameWithUnique = `${fieldObject.doc_number}__ALGAEH__${filename}`;
        let fullImagePath = path.join(uploadSpecificFolder, fileNameWithUnique);

        // console.log("errrror", fullImagePath);

        const existsFileName = fs
          .readdirSync(uploadSpecificFolder)
          .map((fileName) => {
            if (fileName.includes(fileNameWithUnique)) {
              return fileName;
            }
          })
          .filter((f) => f !== null);
        const exists =
          existsFileName.length > 0
            ? existsFileName?.find((item) => item === fileNameWithUnique)
            : undefined;
        // console.log("exists", existsFileName, exists);
        let fStream;
        if (exists) {
          fileNameWithUnique = `${fieldObject.doc_number}-${
            parseInt(existsFileName.length) + 1
          }__ALGAEH__${filename}`;
          // console.log("iamheteteteetetete", fileNameWithUnique);
          let fullImagePathUn = path.join(
            uploadSpecificFolder,
            fileNameWithUnique
          );

          fStream = fs.createWriteStream(fullImagePathUn);
          file.pipe(fStream);
          fStream.on("close", () => {
            res.status(200).json({
              success: true,
              records: fileNameWithUnique,
              message: "Updated Successfully",
            });
          });
        } else {
          // console.log("iamheteteteetetetee63264723647346");
          fStream = fs.createWriteStream(fullImagePath);
          file.pipe(fStream);
          fStream.on("close", () => {
            res.status(200).json({
              success: true,
              records: fileNameWithUnique,
              message: "Updated Successfully",
            });
          });
        }

        // file.pipe(fStream);
        // fStream.on("close", () => {
        //   res.status(200).json({
        //     success: true,
        //     records: fileNameWithUnique,
        //     message: "Updated Successfully",
        //   });
        // });
      }
    );
  } catch (error) {
    next(error);
  }
}

export function getUploadedPatientFiles(req, res, next) {
  try {
    const input = req.query;
    const { filePath } = input;
    const directoryPath = path.join(folder, "UPLOAD");

    const completePath = path.join(directoryPath, filePath);
    fs.access(completePath, fs.constants.F_OK, (err) => {
      // console.log("Iam herererer", "<====>", err);
      if (err) {
        res.status(200).json({ success: false }).end();
      } else {
        fs.readdir(completePath, function (err, files) {
          //handling error

          if (err) {
            // console.log("Iam herererer", "<====>", err);
            res.status(400).json({ error: err.message });
          } else {
            const arrayFiles = files.map((item) => {
              const fullPath = `${completePath}${item}`;
              const nameFile = item.split("__ALGAEH__");
              return { name: nameFile[nameFile.length - 1], value: fullPath };
            });

            res.status(200).json({ success: true, data: arrayFiles }).end();
          }
          //listing all files using forEach
          // files.forEach(function (file) {
          // Do whatever you want to do with the file

          // });
        });
      }
    });

    // console.log("completePath====>", completePath);
    //passsing directoryPath and callback function

    // let commonItemDoc;
    // // // let filter = {};

    // commonItemDoc = uploadDocumentSchema;
    // const { doc_number } = input;
    // // const uploadExists = folder.toUpperCase().includes("UPLOAD");
    // // const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");

    // // const uploadedDocFolder = path.join(uploadPath, docUploadedFolder);

    // // const docFolder = path.join(uploadedDocFolder, doc_number);
    // // filter = { sub_department_id, filename };
    // // const subId = parseInt(sub_department_id);

    // // fs.readdir(docFolder, function (err, files) {
    // //   //handling error
    // //   if (err) {
    // //     res.status(400).json({ error: err.message });
    // //   } else {
    // //     res.status(200).json({ success: true, data: files });
    // //   }
    // // });
    // commonItemDoc.find({ doc_number }, (err, docs) => {
    //   if (err) {
    //     res.status(400).json({ error: err.message });
    //   } else {
    //     res.status(200).json({ success: true, data: docs });
    //   }
    // });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}
export const downloadPatDocument = (req, res) => {
  const { fileName } = req.query;
  // console.log("Error in access===>", fileName);
  fs.access(fileName, fs.constants.F_OK, (err) => {
    if (err) {
      // console.log("Error in access===>", err);
      res.status(400).json({ error: err.message });
    }

    // throw err;
  });
  fs.readFile(fileName, (err, content) => {
    if (err) {
      // console.log("Error in reading====>", err);
      res.status(400).json({ error: err.message });
      // throw err;
    } else {
      res.writeHead(200, { "Content-type": "application/pdf" });
      res.end(content, () => {
        fs.unlinkSync(fileName);
      });
    }
  });
};
export const deletePatientDocs = (req, res) => {
  const { completePath } = req.body;

  // if (err) {
  //   res.status(400).json({ error: err.message });
  // } else {
  fs.unlink(completePath, (err) => {
    if (err) {
      throw res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true });
    }
  });
};
