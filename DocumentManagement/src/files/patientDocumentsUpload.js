import path from "path";
// import stream from "stream";
import fs from "fs-extra";
import mime from "mime-types";
import contract from "../Model/contractDocs";
// import imageThumbnail from "image-thumbnail";
// import PatientDocModel from "./patientDoc";
// import CompanyDocModel from "./company";
// import formidable from "formidable";
import "regenerator-runtime/runtime";
import { rename, stat } from "fs";

const folder = process.env.UPLOADFOLDER || process.cwd();
export async function uploadPatientDoc(req, res, next) {
  try {
    // const fieldObject = req.headers["x-file-details"]
    //   ? JSON.parse(req.headers["x-file-details"])
    //   : {}
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
              fullImagePath: uploadSpecificFolder,
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

export async function getUploadedPatientFiles(req, res, next) {
  try {
    const input = req.query;
    const { filePath, doc_number } = input;
    const directoryPath = path.join(folder, "UPLOAD");

    const completePath = path.join(directoryPath, filePath);

    if (!fs.pathExistsSync(completePath)) {
      contract.find({ contract_no: doc_number }, (err, docs) => {
        docs.map((item) => {
          // const currentPath = path.join(__dirname, item.document);
          // const destinationPath = path.join(__dirname, completePath,`${item.contract_no}__ALGAEH__${item.filename}`);

          //         fs.rename(item.document, destinationPath, function (err) {
          //             if (err) {
          //                 throw err
          //             } else {
          //               getFilesTopush(completePath)
          //               }})
          //             }  else{

          req.query.fileName = item.document;
          req.query.oldMethod = true;

          req.query.oldPath = item.document;
          req.query.name = item.filename;
          // req.query.PatientFolderName=true;
          // req.query.oldMethod=true;
          downloadPatDocument(req, res);
          //             if(fileData){
          //               console.log("iam herere, 21223123")
          //               const formData = new FormData();
          //             formData.append("doc_number", doc_id);
          //             formData.append("nameOfTheFolder", nameOfTheFolder);
          //             formData.append("PatientFolderName", patient_code);
          //             fileData.forEach((file, index) => {
          //               formData.append(`file_${index}`, file, item.filename);
          //               formData.append("fileName", item.filename);
          //             });
          //       req.body=formData;
          //       console.log("iam here 34",formData);
          //       uploadPatientDoc(req,res,next).then((result) => {

          // console.log("test",result);
          //         getFilesTopush(result.fullImagePath)
          //       });
          //             }
        });
      });
    } else {
      fs.access(completePath, fs.constants.F_OK, (err) => {
        if (err) {
          res.status(200).json({ success: false }).end();
        } else {
          fs.readdir(completePath, function (err, files) {
            if (err) {
              res.status(400).json({ error: err.message });
            } else {
              // if(files.length>0){

              const arrayFiles = files.map((item) => {
                const fullPath = `${completePath}${item}`;
                const nameFile = item.split("__ALGAEH__");

                return { name: nameFile[nameFile.length - 1], value: fullPath };
              });
              // console.log("Iam herererer", "<====>",fullPath,"name",nameFile);
              res.status(200).json({ success: true, data: arrayFiles }).end();
              // }
            }
            //listing all files using forEach
            // files.forEach(function (file) {
            // Do whatever you want to do with the file

            // });
          });
        }
      });
    }

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
const getFilesTopush = (completePath) => {
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
      });
    }
  });
};
export const downloadPatDocument = (req, res) => {
  const { fileName, oldMethod, oldPath } = req.query;

  fs.access(fileName, fs.constants.F_OK, (err) => {
    if (err) {
      // console.log("Error in access===>", err);
      res.status(400).json({ error: err.message });
    }

    // throw err;
  });
  fs.readFile(fileName, (err, content) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // throw err;
    } else {
      const extension = mime.contentType(path.extname(fileName));

      if (oldMethod) {
        const currentPath = path.join(__dirname, oldPath);
        let fullDocumentPath;
        const uploadExists = folder.toUpperCase().includes("UPLOAD");
        const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
        if (!fs.pathExistsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        const patientFolderName = path.join(uploadPath, "PatientDocuments");
        if (!fs.pathExistsSync(patientFolderName)) {
          fs.mkdirSync(patientFolderName);
        }
        const patientFolder = path.join(
          patientFolderName,
          req.query.patient_code
        );
        if (!fs.pathExistsSync(patientFolder)) {
          fs.mkdirSync(patientFolder);
        }
        const uploadDocFolder = path.join(
          patientFolder,
          req.query.nameOfTheFolder
        );
        if (!fs.pathExistsSync(uploadDocFolder)) {
          fs.mkdirSync(uploadDocFolder);
        }
        let uploadSpecificFolder = path.join(
          uploadDocFolder,
          req.query.doc_number
        );
        if (!fs.pathExistsSync(uploadSpecificFolder)) {
          fs.mkdirSync(uploadSpecificFolder);
        }

        let fileNameWithUnique = `${req.query.doc_number}__ALGAEH__${req.query.name}`;
        fullDocumentPath = path.join(uploadSpecificFolder, fileNameWithUnique);

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

        if (exists) {
          fileNameWithUnique = `${fieldObject.doc_number}-${
            parseInt(existsFileName.length) + 1
          }__ALGAEH__${req.query.name}`;
          // console.log("iamheteteteetetete", fileNameWithUnique);
          fullDocumentPath = path.join(
            uploadSpecificFolder,
            fileNameWithUnique
          );
          const newPath = path.join(__dirname, fullDocumentPath);

          fs.rename(currentPath, newPath, function (err) {
            if (err) {
              throw err;
            } else {
              console.log("Successfully moved the file!");
              getUploadedPatientFiles(req, res, next);
            }
          });
        } else {
          const newPath = path.join(__dirname, fullDocumentPath);

          fs.rename(currentPath, newPath, function (err) {
            if (err) {
              throw err;
            } else {
              getUploadedPatientFiles(req, res, next);
            }
          });
        }
      }
      // console.log(" reading====>", extension);
      res.writeHead(200, {
        "Content-type": extension,
      });
      res.end(content);
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
export const deleteMultipleFiles = (req, res) => {
  console.log("iamherreer     11", req.body.deleteFiles);
  const { deleteFiles } = req.body;
  return Promise.all(
    deleteFiles.map(
      (file) =>
        new Promise((resolve, rej) => {
          try {
            fs.unlink(`${file.value}`, (err) => {
              if (err) res.status(400).json({ error: err.message });

              res.status(200).json({ success: true });
            });
          } catch (error) {
            throw error;
          }
        })
    )
  );
};
