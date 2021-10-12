import path from "path";

import fs from "fs-extra";
import mime from "mime-types";
import EmployeeDocModel from "../Model/employeeDoc";

import "regenerator-runtime/runtime";
import { rename, stat } from "fs";

const folder = process.env.UPLOADFOLDER || process.cwd();
export async function uploadEmployeeDoc(req, res, next) {
  console.log("fieldObject iam here");
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
      updatedDate: new Date(),
    };
    req.busboy.on("field", function (key, value) {
      fieldObject[key] = value;

      dataToSave = { ...dataToSave, [key]: value };
    });
    console.log("fieldObject", fieldObject);
    req.busboy.on(
      "file",
      async (fieldName, file, filename, encoding, mimetype) => {
        dataToSave["fromPath"] = true;
        dataToSave["filename"] = filename;
        dataToSave["fileExtention"] = mimetype;
        const EmpFolderName = path.join(uploadPath, "EmployeeDocuments");
        if (!fs.pathExistsSync(EmpFolderName)) {
          fs.mkdirSync(EmpFolderName);
        }
        const EmpFolder = path.join(EmpFolderName, fieldObject.EmpFolderName);
        if (!fs.pathExistsSync(EmpFolder)) {
          fs.mkdirSync(EmpFolder);
        }
        const uploadDocFolder = path.join(
          EmpFolder,
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

        let fStream;
        if (exists) {
          fileNameWithUnique = `${fieldObject.doc_number}-${
            parseInt(existsFileName.length) + 1
          }__ALGAEH__${filename}`;

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
      }
    );
  } catch (error) {
    next(error);
  }
}

export async function getUploadedEmployeeFiles(req, res, next) {
  console.log("iamhere 213123123");
  try {
    const input = req.query;
    const {
      filePath,
      doc_number,
      folderPath,
      nameOfTheFolder,
      movedOldFile,
      filename,
      unique_id_fromMongo,
    } = input;
    const directoryPath = path.join(folder, "UPLOAD");

    const completePath = path.join(directoryPath, filePath);
    console.log("upload ", completePath);
    if (
      (!fs.pathExistsSync(completePath) && unique_id_fromMongo) ||
      !movedOldFile
    ) {
      console.log("old method");
      const docPath = path.join(directoryPath, filename);

      EmployeeDocModel.find({ _id: unique_id_fromMongo }, (err, docs) => {
        if (err) {
          console.log("old method error", err);
          res.status(400).json({ error: err.message });
        } else {
          docs.map((item) => {
            req.query.fileName = item.document;
            req.query.oldMethod = true;

            req.query.oldPath = docPath;
            req.query.name = item.filename;
            req.query.fileExtention = item.fileExtention;
            downloadEmployeeDocument(req, res);
          });
        }
      });
    } else {
      if (unique_id_fromMongo) {
        EmployeeDocModel.findByIdAndDelete(unique_id_fromMongo, (err, docs) => {
          if (err) {
            console.log("finally moved error", err);
            res.status(400).json({ error: err.message });
          }
        });
      }
      console.log("finally moved file", completePath);
      fs.access(completePath, fs.constants.F_OK, (err) => {
        if (err) {
          res.status(200).json({ success: false }).end();
        } else {
          fs.readFile(completePath, (err, content) => {
            if (err) {
              res.status(400).json({ error: err.message });
              // throw err;
            } else {
              const extension = mime.contentType(path.extname(completePath));
              console.log("content type", extension);
              res.writeHead(200, {
                "Content-type": extension,
              });
              res.end(content);
            }
          });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}
export const updateDocumentNamePhysical = (req, res) => {
  const { newPath, oldFilePath } = req.query;

  const directoryPath = path.join(folder, "UPLOAD");
  const currentOldPath = path.join(directoryPath, oldFilePath);
  const currentNewPath = path.join(directoryPath, newPath);
  fs.rename(currentOldPath, currentNewPath, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      console.log("err", err);
      res
        .status(200)
        .json({ success: false, message: "file name updated" })
        .end();
    }
  });
};
export const downloadEmployeeDocument = (req, res) => {
  const { oldMethod, oldPath, fileExtention, name } = req.query;

  const currentPath = path.join(__dirname, oldPath);

  fs.access(oldPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("iam here error", err, oldPath);
      res.status(400).json({ error: err.message });
    } else {
      fs.exists(oldPath, (existsFile) => {
        if (existsFile) {
          console.log("iam here");
          //   });
          //   fs.readdir(currentPath, function (err, files) {
          //     if (err) {
          //       console.log("iam herer 4", "err");
          //       res.status(400).json({ error: err.message });
          //     } else {
          let fullDocumentPath;
          const uploadExists = folder.toUpperCase().includes("UPLOAD");
          const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");

          if (!fs.pathExistsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
          }
          const EmpFolderName = path.join(uploadPath, "EmployeeDocuments");
          if (!fs.pathExistsSync(EmpFolderName)) {
            fs.mkdirSync(EmpFolderName);
          }

          const EmpFolder = path.join(EmpFolderName, req.query.employee_code);
          if (!fs.pathExistsSync(EmpFolder)) {
            fs.mkdirSync(EmpFolder);
          }

          const uploadDocFolder = path.join(
            EmpFolder,
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
          fullDocumentPath = path.join(
            uploadSpecificFolder,
            fileNameWithUnique
          );

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

          if (exists) {
            console.log("exists", exists);
            fileNameWithUnique = `${req.query.doc_number}-${
              parseInt(existsFileName.length) + 1
            }__ALGAEH__${req.query.name}`;

            fullDocumentPath = path.join(
              uploadSpecificFolder,
              fileNameWithUnique
            );
            const newPath = path.join(__dirname, fullDocumentPath);

            fs.rename(currentPath, newPath, function (err) {
              if (err) {
                console.log("error12312", err);
                throw err;
              } else {
                console.log("error12312");
                req.query.movedOldFile = true;
                getUploadedEmployeeFiles(req, res);
              }
            });
          } else {
            const newPath = path.join(__dirname, fullDocumentPath);
            console.log("Successfully moved the file!");
            fs.rename(currentPath, newPath, function (err) {
              if (err) {
                throw err;
              } else {
                req.query.movedOldFile = true;
                getUploadedEmployeeFiles(req, res);
              }
            });
          }
        } else {
          console.log("iam here 123");
          req.query.movedOldFile = true;
          getUploadedEmployeeFiles(req, res);
        }
        // if(files.length>0){

        //   const arrayFiles = files.map((item) => {
        //     const fullPath = `${completePath}${item}`;
        //     const nameFile = item.split("__ALGAEH__");

        //     return { name: nameFile[nameFile.length - 1], value: fullPath };
        //   });
        // console.log("Iam herererer", "<====>",fullPath,"name",nameFile);
        //   res.status(200).json({ success: true, data: arrayFiles }).end();
        // }
      });
      //listing all files using forEach
      // files.forEach(function (file) {
      // Do whatever you want to do with the file

      // });
    }
  });
  //   fs.exists(oldPath, (exists) => {
  //     console.log(exists ? "Found" : "Not Found!");
  //   });
  //   fs.readFile(, (err, content) => {
  //     if (err) {
  //       console.log("iam herer 3");
  //       res.status(400).json({ error: err.message });
  //     } else {
  //       console.log("iam herer 4");
  //       //   const extension = mime.contentType(path.extname(fileName));

  //       if (oldMethod) {
  //         const currentPath = path.join(__dirname, oldPath);
  //         console.log("currentPath", currentPath);
  //         let fullDocumentPath;
  //         const uploadExists = folder.toUpperCase().includes("UPLOAD");
  //         const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
  //         if (!fs.pathExistsSync(uploadPath)) {
  //           fs.mkdirSync(uploadPath);
  //         }
  //         const EmpFolderName = path.join(uploadPath, "EmployeeDocuments");
  //         if (!fs.pathExistsSync(EmpFolderName)) {
  //           fs.mkdirSync(EmpFolderName);
  //         }
  //         const EmpFolder = path.join(EmpFolderName, req.query.employee_code);
  //         if (!fs.pathExistsSync(EmpFolder)) {
  //           fs.mkdirSync(EmpFolder);
  //         }
  //         const uploadDocFolder = path.join(EmpFolder, req.query.nameOfTheFolder);
  //         if (!fs.pathExistsSync(uploadDocFolder)) {
  //           fs.mkdirSync(uploadDocFolder);
  //         }
  //         let uploadSpecificFolder = path.join(
  //           uploadDocFolder,
  //           req.query.doc_number
  //         );
  //         if (!fs.pathExistsSync(uploadSpecificFolder)) {
  //           fs.mkdirSync(uploadSpecificFolder);
  //         }

  //         let fileNameWithUnique = `${req.query.doc_number}__ALGAEH__${req.query.name}`;
  //         fullDocumentPath = path.join(uploadSpecificFolder, fileNameWithUnique);

  //         const existsFileName = fs
  //           .readdirSync(uploadSpecificFolder)
  //           .map((fileName) => {
  //             if (fileName.includes(fileNameWithUnique)) {
  //               return fileName;
  //             }
  //           })
  //           .filter((f) => f !== null);
  //         const exists =
  //           existsFileName.length > 0
  //             ? existsFileName?.find((item) => item === fileNameWithUnique)
  //             : undefined;

  //         if (exists) {
  //           fileNameWithUnique = `${fieldObject.doc_number}-${
  //             parseInt(existsFileName.length) + 1
  //           }__ALGAEH__${req.query.name}`;

  //           fullDocumentPath = path.join(
  //             uploadSpecificFolder,
  //             fileNameWithUnique
  //           );
  //           const newPath = path.join(__dirname, fullDocumentPath);

  //           fs.rename(currentPath, newPath, function (err) {
  //             if (err) {
  //               throw err;
  //             } else {
  //               console.log("Successfully moved the file!");
  //               getUploadedEmployeeFiles(req, res, next);
  //             }
  //           });
  //         } else {
  //           const newPath = path.join(__dirname, fullDocumentPath);

  //           fs.rename(currentPath, newPath, function (err) {
  //             if (err) {
  //               throw err;
  //             } else {
  //               getUploadedEmployeeFiles(req, res, next);
  //             }
  //           });
  //         }
  //       }

  //       res.writeHead(200, {
  //         "Content-type": fileExtention,
  //       });
  //       res.end(content);
  //     }
  //   });
};
export const deleteEmployeeDocs = (req, res) => {
  const { completePath } = req.body;
  const directoryPath = path.join(folder, "UPLOAD");
  const completeDirectoryPath = path.join(directoryPath, completePath);
  console.log("completePath", completeDirectoryPath);
  try {
    fs.rmdirSync(completeDirectoryPath, { recursive: true });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("completePath11231error", err);
    res.status(400).json({ error: err.message });
  }
  // fs.unlink(completePath, (err) => {
  //   if (err) {
  //     throw res.status(400).json({ error: err.message });
  //   } else {
  //     res.status(200).json({ success: true });
  //   }
  // });
};
export const deleteMultipleFilesEmp = (req, res) => {
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
