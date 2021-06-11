import formidable from "formidable";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
export async function uploadFile(req: Request, res: Response) {
  try {
    const folderPath = path.join(__dirname, "../", "templates");
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error("There is error ====>", err);
        res
          .status(400)
          .json({
            success: false,
            message: err.message,
          })
          .end();
      } else {
        const file_name = path.join(folderPath, fields["shortUrl"] + ".pdf");
        const auto_file_name = files.file.path;
        fs.renameSync(auto_file_name, file_name);
        res.write("File uploaded");
        res.end();
      }
    });
  } catch (e) {
    res
      .status(400)
      .json({
        success: false,
        message: e.message,
      })
      .end();
  }
}
