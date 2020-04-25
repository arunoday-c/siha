import mongoose from "mongoose";
import stream from "stream";
import fs from "fs";
import formidable from "formidable";
import base64Img from "base64-img";
const Schema = mongoose.Schema;
const ImageSchema = new Schema(
  {
    image: String,
    image_id: String,
    logo_type: String,
  },
  { autoCreate: true }
);
const ImageModel = mongoose.model("algaeh_organization_logos", ImageSchema);

export default (db) => {
  return {
    saveLogo: (req, res, next) => {
      let form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        if (err) {
          res
            .status(400)
            .json({
              success: false,
              records: err,
            })
            .end();
          return;
        }
        const { image_id, logo_type } = fields;
        const { org_image } = files;
        const { path } = org_image;
        const out = base64Img.base64Sync(path);
        fs.unlinkSync(path);
        ImageModel.findOneAndUpdate(
          {
            image_id: image_id.toString(),
            logo_type: logo_type,
          },
          {
            image: out,
            image_id: image_id.toString(),
            logo_type: logo_type,
          },
          {
            new: true,
            upsert: true,
          }
        )
          .then((result) => {
            res
              .status(200)
              .json({
                success: true,
              })
              .end();
          })
          .catch((error) => {
            res
              .status(400)
              .json({
                success: false,
                records: error,
              })
              .end();
          });
      });
    },
    getLogo: (req, res, next) => {
      const { image_id, logo_type } = req.query;
      ImageModel.findOne({ image_id, logo_type })
        .then((result) => {
          const data = result.image.split(","); //[0].split(":")[1];
          const type = data[0].split(";")[0].split(":")[1];
          res.status(200);
          res.setHeader("content-type", type);
          let bufferStream = new stream.PassThrough();
          bufferStream.end(data[1], "base64");
          bufferStream.pipe(res);
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            records: error,
          });
        });
    },
  };
};
