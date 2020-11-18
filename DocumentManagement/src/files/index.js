import path from "path";
import busboy from "connect-busboy";
import fs from "fs-extra";
import contract from "../Model/contractDocs";
// import formidable from "formidable";
const folder = process.env.UPLOADFOLDER || process.cwd();
export function uploadFile(req, res, next) {
  try {
    const uploadExists = folder.toUpperCase().includes("UPLOAD");
    const fieldObject = req.headers["x-file-details"]
      ? JSON.parse(req.headers["x-file-details"])
      : {};
    const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
    req.pipe(req.busboy);

    req.busboy.on("field", function (key, value) {
      fieldObject[key] = value;
    });
    req.busboy.on("file", (fieldName, file, filename, encoding, mimetype) => {
      // Create a write stream of the new file - 7259827866
      const fStream = fs.createWriteStream(path.join(uploadPath, filename));
      file.pipe(fStream);
      // On finish of the upload
      fStream.on("close", () => {
        fieldObject["file"] = fieldName;
        fieldObject["filename"] = filename;
        fieldObject["document"] = path.join(uploadPath, filename);
        fieldObject["filetype"] = mimetype;
        fieldObject["fromPath"] = true;
        // console.log("Before saving", fieldObject, fieldName);
        // console.log(`Upload of '${filename}' finished`, fieldObject);
        contract.insertMany([fieldObject]);
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
    const { contract_no, filename, download } = req.query;

    if (download) {
      contract.find({ contract_no, filename }, (err, docs) => {
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
            const mimetype = docs[0]["filetype"];
            res.setHeader(
              "Content-disposition",
              "attachment; filename=" + fileN
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
      contract.find({ contract_no }, (err, docs) => {
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
