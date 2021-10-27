import path from "path";

import fs from "fs-extra";
import mime from "mime-types";
import Contracts from "../Model/contractDocs";
import ReceiptEntry from "../Model/receiptEntryDoc";
import "regenerator-runtime/runtime";

const folder = process.env.UPLOADFOLDER || process.cwd();
export async function uploadDocument(req, res, next) {
  console.log("fieldObject iam here");
  try {
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

    req.busboy.on(
      "file",
      async (fieldName, file, filename, encoding, mimetype) => {
        dataToSave["fromPath"] = true;
        dataToSave["filename"] = filename;
        dataToSave["fileExtention"] = mimetype;
        const mainFolder = path.join(uploadPath, fieldObject.mainFolderName);
        if (!fs.pathExistsSync(mainFolder)) {
          fs.mkdirSync(mainFolder);
        }
        // const subFolderName = path.join(EmpFolderName, fieldObject.subFolder);
        // if (!fs.pathExistsSync(subFolderName)) {
        //   fs.mkdirSync(subFolderName);
        // }
        // let subFolder;
        // if (fieldObject.specificFolder) {
        //   subFolder = path.join(
        //     mainFolder,
        //     fieldObject.subFolderName,
        //     fieldObject.specificFolder
        //   );
        //   if (!fs.pathExistsSync(subFolder)) {
        //     fs.mkdirSync(subFolder);
        //   }
        // } else {
        //   subFolder = path.join(mainFolder, fieldObject.subFolderName);
        //   if (!fs.pathExistsSync(subFolder)) {
        //     fs.mkdirSync(subFolder);
        //   }
        // }
        let subFolder;
        if (fieldObject.subFolderName) {
          subFolder = path.join(mainFolder, fieldObject.subFolderName);
          if (!fs.existsSync(subFolder)) {
            fs.mkdirSync(subFolder);
          }
        } else {
          subFolder = mainFolder;
        }
        if (fieldObject.specificFolder) {
          subFolder = path.join(subFolder, fieldObject.specificFolder);
          if (!fs.existsSync(subFolder)) {
            fs.mkdirSync(subFolder);
          }
        }
        const uploadDocFolder = path.join(subFolder, fieldObject.doc_number);
        if (!fs.pathExistsSync(uploadDocFolder)) {
          fs.mkdirSync(uploadDocFolder);
        }
        // let uploadSpecificFolder = path.join(
        //   uploadDocFolder,
        //   fieldObject.doc_number
        // );
        // if (!fs.pathExistsSync(uploadSpecificFolder)) {
        //   fs.mkdirSync(uploadSpecificFolder);
        // }

        let fileNameWithUnique = `${fieldObject.doc_number}__ALGAEH__${filename}`;
        let fullImagePath = path.join(uploadDocFolder, fileNameWithUnique);

        const existsFileName = fs
          .readdirSync(uploadDocFolder)
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

          let fullImagePathUn = path.join(uploadDocFolder, fileNameWithUnique);

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
              fullImagePath: uploadDocFolder,
            });
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

export async function getUploadedFiles(req, res, next) {
  console.log("iamhere 012345678");
  try {
    const input = req.query;
    const { filePath, unique_id, document, movedOldFile, filename } = input;

    const directoryPath = path.join(folder, "UPLOAD");

    const completePath = path.join(directoryPath, filePath);

    if ((fs.pathExistsSync(document) && unique_id) || !movedOldFile) {
      console.log("iamhere 213123123");
      console.log("old method");

      Contracts.find({ _id: unique_id }, (err, docs) => {
        if (err) {
          console.log("old method error", err);
          res.status(400).json({ error: err.message });
        } else {
          docs.map((item) => {
            req.query.fileName = item.document;
            req.query.oldMethod = true;

            req.query.oldPath = document;
            req.query.name = item.filename;
            req.query.fileExtention = item.fileExtention;
            downloadDocument(req, res);
          });
        }
      });
    } else {
      if (unique_id) {
        Contracts.findByIdAndDelete(unique_id, (err, docs) => {
          if (err) {
            console.log("finally moved error", err);
            res.status(400).json({ error: err.message });
          }
        });
      }
      fs.access(completePath, fs.constants.F_OK, (err) => {
        if (err) {
          res.status(200).json({ success: false }).end();
        } else {
          fs.readFile(completePath, (err, content) => {
            if (err) {
              console.log("error in final");
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
export const moveOldFiles = (req, res) => {
  try {
    const input = req.query;
    let Model = input.fromModule === "Receipt" ? ReceiptEntry : Contracts;
    const { contract_no, completePath, hasUniqueId } = input;
    const findObj =
      input.fromModule === "Receipt"
        ? { grn_number: contract_no }
        : { contract_no };
    Model.find(findObj, async (err, docs) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (docs.length > 0) {
          for (let i = 0; i < docs.length; i++) {
            req.fileName = docs[i].filename;
            req.doc_number = hasUniqueId
              ? req.query.doc_number
              : docs[i].contract_id;

            await makeFolderStructure(req, res)
              .then(async (uploadDocFolder) => {
                console.log("ia here");
                let fullDocumentPath;
                let fileNameWithUnique = `${req.doc_number}__ALGAEH__${docs[i].filename}`;
                fullDocumentPath = path.join(
                  uploadDocFolder,
                  fileNameWithUnique
                );

                const existsFileName = fs
                  .readdirSync(uploadDocFolder)
                  .map((fileName) => {
                    if (fileName.includes(fileNameWithUnique)) {
                      return fileName;
                    }
                  })
                  .filter((f) => f !== null);

                const exists =
                  existsFileName.length > 0
                    ? existsFileName?.find(
                        (item) => item === fileNameWithUnique
                      )
                    : undefined;

                if (exists) {
                  console.log("exists", exists);
                  fileNameWithUnique = `${req.query.doc_number}-${
                    parseInt(existsFileName.length) + 1
                  }__ALGAEH__${docs[i].filename}`;

                  fullDocumentPath = path.join(
                    uploadDocFolder,
                    fileNameWithUnique
                  );
                  fullDocumentPath;
                } else {
                  fullDocumentPath;
                }
                if (docs[i].fromPath) {
                  await fs.rename(
                    docs[i].document,
                    fullDocumentPath,
                    function (err) {
                      if (err) {
                        res.status(400).json({ error: err.message });
                      } else {
                        Model.findByIdAndDelete(docs[i]._id, (err, docs) => {
                          if (err) {
                            res.status(400).json({ error: err.message });
                          }
                        });
                      }
                    }
                  );
                } else {
                  const fileContents = new Buffer(docs[i].document, "base64");
                  await fs.writeFile(fullDocumentPath, fileContents, (err) => {
                    if (err) {
                      res.status(400).json({ error: err.message });
                    } else {
                      Model.findByIdAndDelete(docs[i]._id, (err, docs) => {
                        if (err) {
                          res.status(400).json({ error: err.message });
                        }
                      });
                    }
                  });
                }
              })
              .catch((err) => res.status(400).json({ error: err.message }));
          }
          console.log("docs", "iam here");
          const directoryPath = path.join(folder, "UPLOAD");

          const completePathOfFolder = path.join(directoryPath, completePath);
          fs.readdir(completePathOfFolder, function (err, files) {
            if (err) {
              res.status(400).json({ error: err.message });
            } else {
              const arrayFiles = files.map((item) => {
                const fullPath = `${completePathOfFolder}${item}`;
                const nameFile = item.split("__ALGAEH__");

                return {
                  name: nameFile[nameFile.length - 1],
                  value: fullPath,
                };
              });

              res.status(200).json({ success: true, data: arrayFiles }).end();
            }
          });
        } else {
          const directoryPath = path.join(folder, "UPLOAD");

          const completePathOfFolder = path.join(directoryPath, completePath);
          fs.readdir(completePathOfFolder, function (err, files) {
            if (err) {
              res.status(400).json({ error: err.message });
            } else {
              const arrayFiles = files.map((item) => {
                const fullPath = `${completePathOfFolder}${item}`;
                const nameFile = item.split("__ALGAEH__");

                return { name: nameFile[nameFile.length - 1], value: fullPath };
              });

              res.status(200).json({ success: true, data: arrayFiles }).end();
            }
          });
        }
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

async function makeFolderStructure(req, res) {
  const {
    mainFolderName,
    subFolderName,
    specificFolder,
    // doc_number,
    filename,
  } = req.query;

  try {
    const uploadExists = folder.toUpperCase().includes("UPLOAD");
    const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    const mainFolder = path.join(uploadPath, mainFolderName);
    if (!fs.existsSync(mainFolder)) {
      fs.mkdirSync(mainFolder);
    }
    let subFolder;
    if (subFolderName) {
      subFolder = path.join(mainFolder, subFolderName);
      if (!fs.existsSync(subFolder)) {
        fs.mkdirSync(subFolder);
      }
    } else {
      subFolder = mainFolder;
    }
    console.log("subFolder", subFolder);

    // subFolder = path.join(mainFolder, subFolderName);
    // if (!fs.existsSync(subFolder)) {
    //   fs.mkdirSync(subFolder);
    // }
    if (specificFolder) {
      subFolder = path.join(subFolder, specificFolder);
      if (!fs.existsSync(subFolder)) {
        fs.mkdirSync(subFolder);
      }
    }

    const uploadDocFolder = path.join(subFolder, `${req.doc_number}`);
    if (!fs.existsSync(uploadDocFolder)) {
      fs.mkdirSync(uploadDocFolder);
    }
    return uploadDocFolder;
  } catch (err) {
    console.log("error", err);
  }
}
export const downloadFromPath = (req, res) => {
  const { fileName, oldMethod, oldPath } = req.query;

  fs.readFile(fileName, (err, content) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // throw err;
    } else {
      const extension = mime.contentType(path.extname(fileName));

      res.writeHead(200, {
        "Content-type": extension,
      });
      res.end(content);
    }
  });
};
export const downloadDocument = (req, res) => {
  const {
    oldMethod,
    oldPath,
    fileExtention,
    mainFolderName,
    subFolderName,
    specificFolder,
    doc_number,
    filename,
  } = req.query;

  const currentPath = path.join(__dirname, oldPath);

  fs.access(oldPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log("iam here error download", err, oldPath);
      res.status(400).json({ error: err.message });
    } else {
      fs.exists(oldPath, (existsFile) => {
        if (existsFile) {
          let fullDocumentPath;
          const uploadExists = folder.toUpperCase().includes("UPLOAD");
          const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");

          if (!fs.pathExistsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
          }
          const mainFolder = path.join(uploadPath, mainFolderName);
          if (!fs.pathExistsSync(mainFolder)) {
            fs.mkdirSync(mainFolder);
          }

          let subFolder;
          if (specificFolder) {
            subFolder = path.join(mainFolder, subFolderName, specificFolder);
            if (!fs.pathExistsSync(subFolder)) {
              fs.mkdirSync(subFolder);
            }
          } else {
            subFolder = path.join(mainFolder, subFolderName);
            if (!fs.pathExistsSync(subFolder)) {
              fs.mkdirSync(subFolder);
            }
          }
          const uploadDocFolder = path.join(subFolder, doc_number);
          if (!fs.pathExistsSync(uploadDocFolder)) {
            fs.mkdirSync(uploadDocFolder);
          }

          // let uploadSpecificFolder = path.join(
          //   uploadDocFolder,
          //   req.query.doc_number
          // );
          // if (!fs.pathExistsSync(uploadSpecificFolder)) {
          //   fs.mkdirSync(uploadSpecificFolder);
          // }

          let fileNameWithUnique = `${req.query.doc_number}__ALGAEH__${filename}`;
          fullDocumentPath = path.join(uploadDocFolder, fileNameWithUnique);

          const existsFileName = fs
            .readdirSync(uploadDocFolder)
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
            }__ALGAEH__${filename}`;

            fullDocumentPath = path.join(uploadDocFolder, fileNameWithUnique);
            const newPath = path.join(__dirname, fullDocumentPath);

            fs.rename(currentPath, newPath, function (err) {
              if (err) {
                console.log("error12312", err);
                throw err;
              } else {
                console.log("error12312");
                req.query.movedOldFile = true;
                getUploadedFiles(req, res);
              }
            });
          } else {
            const newPath = path.join(__dirname, fullDocumentPath);
            console.log("Successfully moved the file!");

            fs.rename(currentPath, newPath, function (err) {
              if (err) {
                console.log(err, "Successfully moved wire");
                throw err;
              } else {
                req.query.movedOldFile = true;
                getUploadedFiles(req, res);
              }
            });
          }
        } else {
          console.log("iam here 123");
          req.query.movedOldFile = true;
          getUploadedFiles(req, res);
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
export const deleteDocs = (req, res) => {
  const { completePath } = req.body;

  try {
    fs.rmdirSync(completePath, { recursive: true });

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
