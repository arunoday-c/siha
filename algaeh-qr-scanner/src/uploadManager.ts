import formidable from "formidable";
import path from "path";
// import fs from "fs";
import mv from "mv";
import { Request, Response } from "express";
export async function uploadFile(req: Request, res: Response) {
  try {
    const folderPath = path.join(__dirname, "../", "templates");
    let form = new formidable.IncomingForm({ maxFileSize: 20 * 1024 * 1024 });
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
        mv(auto_file_name, file_name, (err) => {
          if (err) {
            res
              .status(400)
              .json({
                success: false,
                message: err.message,
              })
              .end();
          } else {
            res.write("File uploaded");
            res.end();
          }
        });
        // fs.renameSync(auto_file_name, file_name);
      }
    });
  } catch (e: any) {
    res
      .status(400)
      .json({
        success: false,
        message: e.message,
      })
      .end();
  }
}
