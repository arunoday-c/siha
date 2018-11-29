import mongoose from "mongoose";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import config from "../../../keys/keys";
import crypto from "crypto";
const connection = mongoose.connect(
  config.mongoDb.connectionURI,
  {
    useNewUrlParser: true
  }
);
const conn = mongoose.createConnection(config.mongoDb.connectionURI, {
  useNewUrlParser: true
});
let gfs;

conn.once("open", () => {
  console.log("Open connection for mongoose");
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

let storage = new GridFsStorage({
  // url: config.mongoDb.connectionURI,
  db: connection,
  file: (req, file) => {
    console.log("before promisify", file);
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

module.exports = {
  saveDocument: (req, res, next) => {
    console.log("Here in save Document", req.file);
    const upload = multer({ storage }).single("image");
    upload(req, res, error => {
      const MyModel = conn.model("algaeh_hims_employees");
      const m = new MyModel();
      var post = new BlogPost();
      m.save(); // works
      console.log("File uploaded successful");
    });

    res.status(200).json({
      success: true,
      records: req.file
    });
  }
};
