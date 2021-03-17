import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs-extra";
import cors from "cors";
import shortid from "shortid";
// import validUrl from "valid-url";
const app = express();
const port = process.env.PORT ?? 3024;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`QR Server started at http://localhost:${port}`);
});
const folderPath = path.join(__dirname, "../", "templates");
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}
app.post("/fileShare", (req: Request, res: Response) => {
  try {
    const { filePath, shortUrl } = req.body;
    if (filePath && filePath !== "") {
      if (fs.existsSync(filePath)) {
        const pdfPath = path.resolve(folderPath, shortUrl + ".pdf");
        fs.copySync(filePath, pdfPath);

        res
          .status(200)
          .json({ message: "Successfully updated", success: true })
          .end();
      } else {
        throw new Error("File not exist in the given path");
      }
    } else {
      throw new Error("File path does not exists");
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false }).end();
  }
});
app.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (shortid.isValid(id)) {
      const pdfPath = path.resolve(folderPath, id + ".pdf");
      const _fs = fs.createReadStream(pdfPath);
      res.writeHead(200, {
        "content-type": "application/pdf",
        "content-disposition": "attachment;filename=pcrTest.pdf",
      });
      _fs.pipe(res);
    } else {
      res.send("Invalid URL").end();
    }
  } catch (err) {
    res
      .send("There is in error in fetch report please contact to hospital")
      .end();
  }
});
