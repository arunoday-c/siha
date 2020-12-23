import path from "path";
import stream from "stream";
import fs from "fs-extra";
import mime from "mime-types";
import contract from "../Model/contractDocs";
import EmployeeDocModel from "../Model/employeeDoc";
// import PatientDocModel from "./patientDoc";
// import CompanyDocModel from "./company";
// import formidable from "formidable";
const folder = process.env.UPLOADFOLDER || process.cwd();
export function uploadFile(req, res, next) {
  try {
    const uploadExists = folder.toUpperCase().includes("UPLOAD");
    const fieldObject = req.headers["x-file-details"]
      ? JSON.parse(req.headers["x-file-details"])
      : {};
    const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
    if (!fs.pathExistsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    req.pipe(req.busboy);

    req.busboy.on("field", function (key, value) {
      fieldObject[key] = value;
    });
    req.busboy.on("file", (fieldName, file, filename, encoding, mimetype) => {
      // Create a write stream of the new file - 7259827866
      const fStream = fs.createWriteStream(path.join(uploadPath, filename));
      file.pipe(fStream);
      // On finish of the upload
      // const _headerFile = JSON.parse(req.headers["x-file-details"]);
      fStream.on("close", () => {
        // fieldObject["file"] = fieldName;
        // fieldObject["filename"] = filename;
        // fieldObject["document"] = path.join(uploadPath, filename);
        // fieldObject["filetype"] = mimetype;
        // fieldObject["fromPath"] = true;
        const forModule = fieldObject["forModule"];
        let contractDoc = undefined;
        let dataToSave = fieldObject;

        switch (forModule) {
          case "EmployeeDocModel":
            contractDoc = EmployeeDocModel;

            dataToSave = {
              pageName: fieldObject["pageName"],
              clientID: req.headers["x-client-ip"],
              destinationName: fieldObject["destinationName"],
              fromPath: true,
              fileExtention: mimetype,
              filename: filename,
              updatedDate: new Date(),
            };

            break;
          default:
            contractDoc = contract;
            dataToSave = {
              file: fieldName,
              filename: filename,
              document: path.join(uploadPath, filename),
              filetype: mimetype,
              fromPath: true,
              ...fieldObject,
            };
        }

        // console.log("Before saving", fieldObject, fieldName);
        // console.log(`Upload of '${filename}' finished`, fieldObject);
        contractDoc.insertMany([dataToSave]);
        res.status(200).json({
          success: true,
        });
      });
    });
  } catch (error) {
    next(error);
  }
}

export function getUploadedFile(req, res, next) {
  try {
    const input = req.query;

    let contractDoc;
    let filter = {};
    let _mimeType = "filetype";
    const { download } = input;
    // console.log("input", input);
    switch (input.forModule) {
      case "EmployeeDocModel":
        contractDoc = EmployeeDocModel;
        const { destinationName } = input;
        filter = { destinationName };
        _mimeType = "fileExtention";
        break;

      default:
        contractDoc = contract;
        const { contract_no, filename } = input;
        filter = { contract_no, filename };
    }

    if (download) {
      // console.log("filter", filter);
      contractDoc.find(filter, (err, docs) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        } else {
          if (Array.isArray(docs) && docs.length === 0) {
            res.status(400).json({ error: "no record found", filter: filter });
            return;
          }

          const { fromPath } = docs[0];
          // console.log("-----fromPath", fromPath);
          // console.log("docs", typeof docs, docs);
          if (fromPath) {
            const uploadExists = folder.toUpperCase().includes("UPLOAD");
            const uploadPath = path.resolve(
              folder,
              uploadExists ? "" : "UPLOAD"
            );
            const fileN = docs.length === 0 ? "" : docs[0].filename;
            if (fileN !== "") {
              const readStream = fs.createReadStream(
                `${path.resolve(uploadPath, fileN)}`
              );
              const mimetype = docs[0][_mimeType];
              res.setHeader(
                "Content-disposition",
                "attachment; filename='" +
                  fileN.replace(/\,/g, "_").replace(/\;/g, "_") +
                  "'"
              );
              res.setHeader("Content-type", mimetype);
              readStream.on("open", function () {
                readStream.pipe(res);
              });
              readStream.on("error", function (err) {
                console.log("error", err);
                res.end(err);
              });
            } else {
              res.end(new Error("No file exists"));
            }
          } else {
            const _fileMime = mime.lookup(docs[0].fileExtention);
            if (docs[0].image) {
              res.setHeader(
                "Content-disposition",
                `attachment; filename='${docs[0]["destinationName"]
                  .replace(/\,/g, "_")
                  .replace(/\;/g, "_")}.${docs[0].fileExtention}'`
              );
              res.setHeader("content-type", _fileMime);
              res.status(200);
              let bufferStream = new stream.PassThrough();
              bufferStream.end(docs[0].image, "base64");
              bufferStream.pipe(res);
            }
          }

          // res.status(200).json({ success: true, data: docs });
        }
      });
    } else {
      const { contract_no } = input;
      contractDoc.find({ contract_no }, (err, docs) => {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          res.status(200).json({ success: true, data: docs });
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
