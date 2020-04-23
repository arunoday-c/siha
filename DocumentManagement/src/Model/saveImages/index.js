import mongoose from "mongoose";
import stream from "stream";
import fs from "fs";
import formidable from "formidable";
import base64Img from "base64-img";
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  image: String,
  image_id: String,
  logo_type: String,
});
const ImageModel = mongoose.model("algaeh_organization_logos", ImageSchema);

export default (db) => {
  return {
    saveLogo: (req, res, next) => {
      let form = new formidable.IncomingForm();
      form.parse(req);
      form.on(fileds, (name, value) => {
        console.log([name], value);
      });
      form.on("file", (name, file) => {
        console.log("file", file);
      });
    },
    //   form.parse(req, function (err, fields, files) {
    //     if (err) {
    //       console.error(err.message);
    //       return;
    //     }
    //     console.log("fields", fields);
    //     console.log("files.path", files[0].path);
    //     const out = base64Img.base64Sync(files[0].path);
    //     console.log("out", out);
    //   });
    // },
    // saveLogo: (req, res, next) => {
    //   try {
    //     var form = new formidable.IncomingForm();

    //     let buffer = "";
    //     const { image_id, logo_type } = JSON.parse(
    //       req.headers["x-file-details"]
    //     );
    //     req.on("data", (chunk) => {
    //       buffer += chunk.toString();
    //     });
    //     req.on("end", () => {
    //       const _utf = buffer;
    //       ImageModel.findOneAndUpdate(
    //         {
    //           image_id: image_id,
    //           logo_type: logo_type,
    //         },
    //         {
    //           image: _utf,
    //           image_id: image_id,
    //           logo_type: logo_type,
    //         }
    //       )
    //         .then((result) => {
    //           res
    //             .status(200)
    //             .json({
    //               success: true,
    //               records: "Uploaded",
    //             })
    //             .end();
    //         })
    //         .catch((error) => {
    //           res
    //             .status(400)
    //             .json({
    //               success: false,
    //               records: error,
    //             })
    //             .end();
    //         });
    //     });
    //   } catch (error) {
    //     next(error);
    //   }
    // },
  };
};
