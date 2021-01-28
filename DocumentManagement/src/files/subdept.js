import path from "path";
// import stream from "stream";
import fs from "fs-extra";
// import mime from "mime-types";
import subDeptImages from "../Model/subDeptImages";
import imageThumbnail from "image-thumbnail";
// import PatientDocModel from "./patientDoc";
// import CompanyDocModel from "./company";
// import formidable from "formidable";
import "regenerator-runtime/runtime";
const folder = process.env.UPLOADFOLDER || process.cwd();
export async function uploadSubDeptImg(req, res, next) {
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
        subDeptImages.insertMany([dataToSave], (err, docs) => {
          if (err) {
            next(err);
            return;
          }
          if (docs.length === 0) {
            next(new Error("Error in inserting to document server."));
            return;
          }
          const unique = docs[0]._id.toString();

          const uploadedSubFolder = path.join(
            uploadPath,
            fieldObject.sub_department_id
          );
          if (!fs.pathExistsSync(uploadedSubFolder)) {
            fs.mkdirSync(uploadedSubFolder);
          }
          const fileNameWithUnique = `${unique}__ALGAEH__${filename}`;
          const fullImagePath = path.join(
            uploadedSubFolder,
            fileNameWithUnique
          );
          const fStream = fs.createWriteStream(fullImagePath);
          file.pipe(fStream);
          fStream.on("close", async () => {
            const uploadedThumbnail = path.join(uploadedSubFolder, "thumbnail");
            if (!fs.pathExistsSync(uploadedThumbnail)) {
              fs.mkdirSync(uploadedThumbnail);
            }
            const options = {
              width: 100,
              height: 100,
              jpegOptions: { force: true, quality: 90 },
            };
            const thumbnail = await imageThumbnail(fullImagePath, options);

            fs.writeFileSync(
              path.join(uploadedThumbnail, fileNameWithUnique),
              thumbnail,
              "binary"
            );

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

export function getUploadedSubFile(req, res, next) {
  try {
    const input = req.query;

    let subDeptDoc;
    // let filter = {};

    subDeptDoc = subDeptImages;
    const { sub_department_id, filename } = input;
    // filter = { sub_department_id, filename };
    // const subId = parseInt(sub_department_id);
    subDeptDoc.find({ sub_department_id }, (err, docs) => {
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
export const deleteSubDeptImage = (req, res) => {
  const { _id } = req.body;
  const id = _id;
  subDeptImages.findByIdAndDelete(id.trim(), (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      // if (docs.fromPath === true) {
      const uploadExists = folder.toUpperCase().includes("UPLOAD");
      const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");

      const uploadedSubFolder = path.join(
        uploadPath,
        `${docs.sub_department_id}`
      );
      const uploadedThumbnail = path.join(uploadedSubFolder, "thumbnail");

      fs.unlinkSync(
        path.resolve(uploadedSubFolder, `${id}__ALGAEH__${docs.filename}`)
      );
      fs.unlinkSync(
        path.resolve(uploadedThumbnail, `${id}__ALGAEH__${docs.filename}`)
      );
      // }
      res.status(200).json({ success: true, data: docs });
    }
  });
};
