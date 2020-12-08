import path from "path";
import fs from "fs-extra";
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
      contractDoc.find(filter, (err, docs) => {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          console.log("docs", docs);
          const uploadExists = folder.toUpperCase().includes("UPLOAD");
          const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
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
